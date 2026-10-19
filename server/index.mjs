import http from 'node:http';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const API_KEY = process.env.TAVUS_API_KEY || '';
const PERSONA_ID = process.env.TAVUS_PERSONA_ID || '';
const REPLICA_ID = process.env.TAVUS_REPLICA_ID || '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const MAX_BODY_BYTES = 8000;

function send(res, status, payload, origin = '') {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...(origin ? {'Access-Control-Allow-Origin': origin, 'Vary': 'Origin'} : {})
  });
  res.end(JSON.stringify(payload));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return send(res, 403, {error:'Origin not allowed'});
  if (req.method === 'OPTIONS') {
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) return send(res, 403, {error:'Origin not allowed'});
    res.writeHead(204, {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'});
    return res.end();
  }
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (req.method === 'GET' && path === '/health') return send(res, 200, {ok:true,service:'crowrules-santa-api',providerConfigured:Boolean(API_KEY && PERSONA_ID && REPLICA_ID)}, origin);
  if (req.method !== 'POST' || path !== '/api/santa/session') return send(res, 404, {error:'Not found'}, origin);
  if (!origin && ALLOWED_ORIGINS.length) return send(res, 403, {error:'Origin required'});
  if (!API_KEY || !PERSONA_ID || !REPLICA_ID) return send(res, 503, {error:'Santa video service is not configured. Set the provider API key, persona ID, and replica ID on the server.'}, origin);
  let body;
  try { body = await readBody(req); }
  catch (error) { return send(res, error.message === 'Invalid JSON' ? 400 : 413, {error:error.message}, origin); }
  const locale = typeof body.locale === 'string' ? body.locale.slice(0,35) : 'en-US';
  try {
    const upstream = await fetch('https://tavusapi.com/v2/conversations', {
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':API_KEY},
      body:JSON.stringify({
        persona_id:PERSONA_ID,
        replica_id:REPLICA_ID,
        conversational_context:'You are Santa Claus in the CrowRules Holidays Hub. Be warm, playful, inclusive, and age-appropriate. Do not ask children for their full name, address, school, phone number, passwords, or other private information. Never promise gifts or claim you can see the visitor. If asked about an unsafe situation, encourage the visitor to speak to a trusted adult. Respond in the visitor language when practical. Locale: ' + locale
      }),
      signal:AbortSignal.timeout(15000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('Tavus session creation failed with status', upstream.status);
      return send(res, 502, {error:'The live avatar provider could not create a session. Check provider settings and server configuration.'}, origin);
    }
    const conversationUrl = typeof data.conversation_url === 'string' ? data.conversation_url : '';
    if (!conversationUrl || new URL(conversationUrl).protocol !== 'https:') {
      console.error('Tavus response did not include a secure conversation_url');
      return send(res, 502, {error:'The avatar provider returned an invalid session URL.'}, origin);
    }
    return send(res, 201, {conversation_url:conversationUrl,conversation_id:typeof data.conversation_id === 'string' ? data.conversation_id : undefined}, origin);
  } catch (error) {
    console.error('Santa session request failed:', error.name || 'Error');
    return send(res, 502, {error:'The live Santa service could not be reached. Try again shortly.'}, origin);
  }
});
server.listen(PORT, HOST, () => console.log('CrowRules Santa API listening on ' + HOST + ':' + PORT));

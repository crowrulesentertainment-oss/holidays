(()=>{'use strict';
const cfg=window.CROWRULES_SUPABASE_CONFIG||{};
const ready=()=>window.supabase&&cfg.url&&cfg.publishableKey&&!cfg.url.includes('YOUR_PROJECT_REF')&&!cfg.publishableKey.includes('YOUR_SUPABASE');
let client=null;
function getClient(){if(!ready())return null;if(!client)client=window.supabase.createClient(cfg.url,cfg.publishableKey);return client}
function setStatus(msg,type='info'){const el=document.querySelector('[data-cloud-status]');if(el){el.textContent=msg;el.dataset.kind=type}}
async function refreshAuth(){const c=getClient(),label=document.querySelectorAll('[data-auth-label]');if(!c){label.forEach(x=>x.textContent='Member sign-in');return null}const {data:{session}}=await c.auth.getSession();label.forEach(x=>x.textContent=session?.user?.email||'Member sign-in');return session}
async function syncLocal(){const c=getClient();if(!c){setStatus('Add your Supabase project URL and publishable key in js/supabase-config.js, then reload.','warning');return}
 const {data:{user}}=await c.auth.getUser();if(!user){setStatus('Sign in first to sync your saved items.','warning');return}
 let local={};try{local=JSON.parse(localStorage.getItem('cr-holiday-hub-v1'))||{}}catch{}
 const ensureId=item=>{if(!item._cloud_id)item._cloud_id=crypto.randomUUID();return item._cloud_id};
 let count=0,errors=[];
 const jobs=[['letters','holiday_letters',x=>({user_id:user.id,local_id:ensureId(x),display_name:x.name||'',message:x.message||'',kindness_note:x.kindness||''})],['traditions','holiday_traditions',x=>({user_id:user.id,local_id:ensureId(x),holiday_name:x.holiday||'All occasions',title:x.title||'My tradition',description:x.description||x.idea||'',schedule_note:x.schedule||'',is_public:false})],['memories','holiday_memories',x=>({user_id:user.id,local_id:ensureId(x),holiday_name:x.holiday||'Everyday magic',title:x.title||'A saved memory',story:x.story||x.text||'',people_note:x.people||'',memory_date:x.date||null,is_public:false})]];
 try{localStorage.setItem('cr-holiday-hub-v1',JSON.stringify(local))}catch{}
 for(const [key,table,map] of jobs){for(const item of (local[key]||[])){const payload=map(item);if(!payload.message&&!payload.description&&!payload.story)continue;const {error}=await c.from(table).upsert(payload,{onConflict:'user_id,local_id'});if(error)errors.push(table+': '+error.message);else count++}}
 try{localStorage.setItem('cr-holiday-hub-v1',JSON.stringify(local))}catch{}
 if(errors.length)setStatus(`Synced ${count} item(s). Some items need attention: ${errors[0]}`,'warning');else setStatus(`Sync complete: ${count} item(s) uploaded or updated. Repeat sync will update matching items instead of duplicating them.`,'success');
}
async function authPage(){const c=getClient(),form=document.querySelector('#auth-form');if(!form)return;if(!c){setStatus('Setup required: add the Supabase URL and publishable key to js/supabase-config.js.','warning');return}
 await refreshAuth();const {data:{session}}=await c.auth.getSession();if(session){document.querySelector('#signed-in-panel')?.removeAttribute('hidden');const who=document.querySelector('#signed-in-email');if(who)who.textContent=session.user.email;form.hidden=true}
 form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||''),mode=fd.get('mode');setStatus('Working securely with Supabase…');let result;
 if(mode==='signup')result=await c.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname.replace(/members\/index\.html$/,'members/index.html')}});else result=await c.auth.signInWithPassword({email,password});
 if(result.error){setStatus(result.error.message,'error');return}if(mode==='signup'&&!result.data.session){setStatus('Account created. Check your email for the confirmation link before signing in.','success');return}setStatus('Signed in successfully.','success');location.reload();
 });document.querySelector('#signout-button')?.addEventListener('click',async()=>{await c.auth.signOut();location.reload()});document.querySelector('#sync-button')?.addEventListener('click',syncLocal);
}
document.addEventListener('DOMContentLoaded',()=>{refreshAuth();authPage();document.querySelectorAll('[data-sync-local]').forEach(b=>b.addEventListener('click',syncLocal))});
window.CrowRulesCloud={getClient,refreshAuth,syncLocal,configured:ready};})();
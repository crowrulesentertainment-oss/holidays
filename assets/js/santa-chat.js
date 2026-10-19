(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const form = $('#santa-chat-form');
  const input = $('#santa-message');
  const transcript = $('#santa-transcript');
  const feedback = $('#santa-chat-feedback');
  const status = $('#santa-service-status');
  const portrait = $('#santa-portrait-panel');
  const mic = $('#santa-mic');
  const stop = $('#santa-stop');
  const welcome = $('#santa-welcome');
  if (!form || !input || !transcript) return;
  const history = [];
  let recognition = null;
  let activeUtterance = null;

  function addBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + role;
    bubble.textContent = text;
    transcript.append(bubble);
    transcript.scrollTop = transcript.scrollHeight;
    return bubble;
  }
  function setFeedback(text) { if (feedback) feedback.textContent = text; }
  function speak(text) {
    if (!('speechSynthesis' in window)) { setFeedback('Speech playback is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    activeUtterance = new SpeechSynthesisUtterance(text);
    activeUtterance.rate = .88;
    activeUtterance.pitch = .9;
    activeUtterance.onstart = () => portrait?.classList.add('is-speaking');
    activeUtterance.onend = activeUtterance.onerror = () => portrait?.classList.remove('is-speaking');
    window.speechSynthesis.speak(activeUtterance);
  }
  async function requestReply(message) {
    const endpoint = window.CROWRULES_SANTA_API_URL;
    if (!endpoint) {
      status.textContent = 'Preview mode — no AI service connected';
      addBubble('Thanks for stopping by! This is the front-end preview, so a live AI reply is not available yet. Your message was not sent. When the secure Santa service is connected, I’ll be able to respond to you here.', 'santa');
      setFeedback('Preview only: no message was sent to a server.');
      return;
    }
    let url;
    try { url = new URL(endpoint, window.location.href); }
    catch { setFeedback('The Santa service address is not valid.'); return; }
    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      setFeedback('For safety, the Santa service must use HTTPS. Your message was not sent.'); return;
    }
    try {
      status.textContent = 'Connecting to Santa…';
      const response = await fetch(url.href, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        credentials: url.origin === window.location.origin ? 'same-origin' : 'omit',
        body: JSON.stringify({message, history: history.slice(-12), locale: navigator.language || 'en-US'})
      });
      if (!response.ok) throw new Error('Santa service returned HTTP ' + response.status);
      const data = await response.json();
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Santa service response did not include a reply.');
      const reply = data.reply.trim().slice(0,5000);
      history.push({role:'user',content:message},{role:'assistant',content:reply});
      addBubble(reply,'santa');
      status.textContent = 'Santa service connected';
      setFeedback('Reply received.');
      if (data.audioUrl && typeof data.audioUrl === 'string') {
        const audioUrl = new URL(data.audioUrl, url.href);
        if (audioUrl.protocol === 'https:' || audioUrl.hostname === 'localhost') {
          const audio = new Audio(audioUrl.href);
          audio.onplay = () => portrait?.classList.add('is-speaking');
          audio.onended = audio.onerror = () => portrait?.classList.remove('is-speaking');
          try { await audio.play(); } catch { speak(reply); }
        } else speak(reply);
      } else speak(reply);
    } catch (error) {
      status.textContent = 'Santa service unavailable';
      setFeedback('The live Santa service could not be reached. Please try again later. Your message may have reached the configured service; check its logs before retrying.');
    }
  }

  const startLive = $('#start-live-santa');
  const endLive = $('#end-live-santa');
  const liveStatus = $('#live-santa-status');
  const liveWrap = $('#live-santa-frame-wrap');
  const liveFrame = $('#live-santa-frame');
  async function startLiveSanta() {
    const endpoint = window.CROWRULES_SANTA_SESSION_API_URL;
    if (!endpoint) {
      if (liveStatus) liveStatus.textContent = 'Live video is not configured yet. Deploy the Santa API and set its public endpoint in assets/js/santa-config.js.';
      return;
    }
    let url;
    try { url = new URL(endpoint, window.location.href); }
    catch { if (liveStatus) liveStatus.textContent = 'The Santa session endpoint is invalid.'; return; }
    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      if (liveStatus) liveStatus.textContent = 'For safety, the Santa session endpoint must use HTTPS.';
      return;
    }
    if (startLive) { startLive.disabled = true; startLive.textContent = 'Connecting to the North Pole…'; }
    if (liveStatus) liveStatus.textContent = 'Preparing a secure live session…';
    try {
      const response = await fetch(url.href, {method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},credentials:url.origin===window.location.origin?'same-origin':'omit',body:JSON.stringify({locale:navigator.language||'en-US'})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Santa service unavailable');
      const conversationUrl = new URL(data.conversation_url);
      if (conversationUrl.protocol !== 'https:') throw new Error('The live conversation URL was not secure.');
      if (!liveFrame || !liveWrap) throw new Error('The live video frame is missing.');
      liveFrame.src = conversationUrl.href;
      liveFrame.hidden = false;
      liveWrap.hidden = false;
      if (liveStatus) liveStatus.textContent = 'Live session created. Allow microphone access in the video panel to begin speaking.';
      liveWrap.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    } catch {
      if (liveStatus) liveStatus.textContent = 'Could not start a live Santa session. Check the service configuration and server logs, then try again.';
    } finally {
      if (startLive) { startLive.disabled = false; startLive.innerHTML = 'Start live Santa <span>→</span>'; }
    }
  }
  startLive?.addEventListener('click', startLiveSanta);
  endLive?.addEventListener('click', () => {
    if (liveFrame) { liveFrame.src = 'about:blank'; liveFrame.hidden = true; }
    if (liveWrap) liveWrap.hidden = true;
    if (liveStatus) liveStatus.textContent = 'Live session closed in this page. Confirm the provider session has ended if your provider dashboard tracks active sessions.';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addBubble(message,'visitor');
    input.value = '';
    setFeedback('');
    await requestReply(message);
  });
  if (mic) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      mic.disabled = true;
      mic.title = 'Speech recognition is not supported in this browser. You can still type.';
    } else {
      recognition = new SpeechRecognition();
      recognition.lang = navigator.language || 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.onstart = () => { mic.setAttribute('aria-pressed','true'); mic.textContent = '🎙 Listening…'; setFeedback('Listening. Speak when you are ready.'); };
      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) text += event.results[i][0].transcript;
        input.value = text.trim();
      };
      recognition.onerror = (event) => setFeedback('Microphone input stopped: ' + event.error + '. You can type your message instead.');
      recognition.onend = () => { mic.setAttribute('aria-pressed','false'); mic.textContent = '🎙 Use microphone'; };
      mic.addEventListener('click', () => {
        try { if (mic.getAttribute('aria-pressed') === 'true') recognition.stop(); else recognition.start(); }
        catch { setFeedback('The microphone could not start. Check browser permission and try again.'); }
      });
    }
  }
  stop?.addEventListener('click', () => {
    if (recognition) recognition.stop();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    portrait?.classList.remove('is-speaking');
    setFeedback('Voice playback stopped.');
  });
  welcome?.addEventListener('click', () => speak('Ho ho hello! Welcome to the North Pole. I am so glad you stopped by. What would you like to share today?'));
})();
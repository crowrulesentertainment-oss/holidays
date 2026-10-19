# Talking Santa integration contract

## Current state
The GitHub Pages front end is static. It supports text composition and optional browser speech recognition/speech synthesis. Without `window.CROWRULES_SANTA_API_URL`, it deliberately does not send chat messages. The illustrated portrait and CSS mouth animation are placeholders, not a photorealistic actor, real-time avatar, or synchronized lip tracking.

## Browser contract
Configure `window.CROWRULES_SANTA_API_URL` in a small deployment-specific config script before `santa-chat.js`. Never place model, speech, avatar, or provider API secrets in that file. It may contain only a public HTTPS endpoint URL.

POST JSON:
```json
{
  "message": "Hello Santa",
  "history": [
    {"role":"user","content":"Hi"},
    {"role":"assistant","content":"Ho ho hello!"}
  ],
  "locale": "en-US"
}
```

Expected JSON response:
```json
{"reply":"A friendly, age-appropriate response from Santa.","audioUrl":"https://your-approved-host.example/session-audio"}
```
`audioUrl` is optional. The backend must return an HTTPS audio URL that is short-lived and authorized. Do not return provider secrets, raw upstream errors, private logs, or untrusted HTML. The client treats replies as plain text.

## Backend requirements before launch
- Use a server-side provider SDK or a trusted realtime voice/avatar service. Keep credentials in deployment secrets.
- Authenticate/rate-limit requests; enforce request and history length limits; apply abuse controls and age-appropriate response policy.
- Request microphone permission only after a user action. Explain speech processing and retention before enabling live service.
- Avoid storing transcripts by default. If analytics or retention are introduced, document purpose, retention, access and deletion.
- Use a vendor that supports the required realtime transport and avatar output. Real lip synchronization needs timestamped visemes/blendshapes or a provider-rendered stream; browser speech synthesis plus CSS animation is not synchronized lip sync.
- Configure CORS narrowly if the API is hosted on another origin, validate origin and payload server-side, and use HTTPS everywhere.
- Provide a graceful offline mode, accessible captions/transcripts, stop controls, and a keyboard-operable interface.

## Recommended implementation order
1. Choose the hosted AI/realtime voice and avatar providers.
2. Deploy a small authenticated API adapter (for example, a serverless function or private service).
3. Integrate provider session tokens/ephemeral credentials; never send long-lived API keys to the browser.
4. Return text plus audio/viseme timing or a provider-hosted avatar stream.
5. Test latency, interruptions, mobile browsers, accessibility, privacy and cost limits before public launch.

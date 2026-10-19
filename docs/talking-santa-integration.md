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

 
## Live avatar adapter (Tavus CVI)
The repository now includes an optional Node.js service in `server/index.mjs` that creates a Tavus CVI conversation server-side. The static GitHub Pages site never receives the Tavus API key.

### Setup
1. Create a Tavus account and configure a persona with a child-safe Santa system prompt. Select a licensed/consented Santa replica; do not clone a real person without permission.
2. Deploy the repository's `render.yaml` blueprint to Render, or run the Node service on another HTTPS host.
3. Set server secrets `TAVUS_API_KEY`, `TAVUS_PERSONA_ID`, and `TAVUS_REPLICA_ID`. Set `ALLOWED_ORIGIN` to the exact public website origin, not a wildcard. Multiple exact origins may be comma-separated.
4. Set `window.CROWRULES_SANTA_SESSION_API_URL` in `assets/js/santa-config.js` to `https://YOUR-API-HOST/api/santa/session`. This is a public endpoint URL, not a secret.
5. Check `/health`, start a session from Santa's Office, test microphone permission and end-session behavior, then review provider quotas and billing.

### Security and launch gates
- The server restricts browser origins, bounds JSON request size, does not log conversation content, and does not return provider error bodies.
- CORS is not authentication and does not stop non-browser clients. Add rate limiting/bot protection, cost alerts, and a session concurrency cap before public launch.
- Confirm current provider embed policies, plan limits, retention settings, and pricing before launch. A successful session requires real account credentials and valid persona/replica IDs.
- The frontend embeds the provider-hosted conversation. The existing local text preview remains as a fallback.
- Never put API keys, persona IDs, or replica IDs in client-side files. This app does not store transcripts.

# CrowRules Holidays Hub

A fresh, static HTML/CSS/JavaScript foundation for the CrowRules Entertainment Holidays division.

## Pages
- `index.html` — cinematic hub landing page
- `holidays.html` — searchable 2026 holiday calendar
- `santa.html` — North Pole office experience and local-only letter demo
- `countdowns.html` — live, browser-based countdown timers
- `activities.html` — seasonal activity and tradition ideas
- `assets/css/site.css` — responsive dark evergreen and gold visual system
- `assets/js/app.js` — navigation, calendar filtering, countdowns and demo letter behavior

## Run locally
Open `index.html` in a modern browser. No build step or framework is required.

## Important implementation notes
- This is a static front-end. Santa's Office is a visual/demo experience; it does not currently provide an AI voice conversation, talking avatar, email delivery, or persistent storage.
- The holiday calendar is an introductory US-focused selection, not an exhaustive global calendar. Verify movable, lunar, and region-specific observances before publishing.
- Countdown dates use the visitor's browser local time zone.
- No API keys or secrets belong in this repository's client-side files.

## Next phases
1. Add reviewed holiday datasets and region/culture filters.
2. Add real, licensed seasonal imagery and accessible media controls.
3. Integrate a secure backend for submissions and moderation if needed.
4. Implement the talking-Santa experience through a dedicated service, with explicit microphone permission and clear privacy disclosures.
5. Add automated accessibility and link checks to CI.


## Phase 2 cinematic upgrade
- Added seasonal photo-led layouts and seasonal navigation panels using Unsplash image URLs. Confirm each image's current license/attribution terms before commercial promotion; use approved local copies for production.
- Expanded the holiday list with selected cultural and religious observances. Dates marked estimated or variable must be verified against local calendars.
- Added holiday region filters, category labels, and activity category filters.
- Santa's Office has a browser speech-synthesis welcome demo and downloadable local letter preview. It is not live AI voice chat or a talking avatar.
- Static HTML/CSS/JavaScript only; no server-side message storage or secrets added.


## Phase 3 — launch foundations
- Added an accessible Santa text-chat interface with optional browser microphone input and speech playback.
- The Santa front end intentionally does not transmit messages unless a deployment config supplies `window.CROWRULES_SANTA_API_URL`. Live AI, photorealistic video, and synchronized lip tracking are not active in this repository.
- Added a secure-service integration contract and a holiday-data editorial policy.
- Removed externally hosted Unsplash photo dependencies from CSS. Seasonal visuals now use local CSS treatments until approved, optimized image files are added. Google Fonts import was removed so typography uses local system stacks.
- Added GitHub Actions checks for JavaScript syntax and broken local HTML references.
- The checks run on GitHub Actions after a push; inspect the Actions tab for the result. No live-site browser test or deployment verification is implied by a successful commit.


## Phase 4 — live Santa adapter
- Added an optional Node 20 service at `server/index.mjs` that requests a Tavus CVI conversation from the server, never directly from browser code.
- Added a Render Blueprint (`render.yaml`) with secret environment variables and an exact-origin CORS allowlist.
- Added a live-video launch panel to Santa's Office. It remains safely unconfigured until the public endpoint is set in `assets/js/santa-config.js`.
- Activation requires a Tavus persona and licensed/consented Santa replica, backend deployment, server environment variables, public endpoint configuration, and testing.
- Live AI/video is not active from the commit alone; provider credentials, persona/replica IDs, deployment, and validation are required. Review provider pricing and privacy/retention controls before public launch.

# CrowRules Holidays Hub — V3.1

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


## Holiday hubs expansion
- Added a searchable directory of 47 curated holiday hubs covering seasonal, family, civic, heritage, religious, remembrance, and international observances.
- Added a reusable holiday detail page (holiday.html with a holiday ID query parameter) for each hub, with meaning, traditions, activities, food inspiration, seasonal media ideas, and links to keep exploring.
- Added search, category and month filters; calendar cards link into a dedicated hub where a matching hub exists.
- Dates and traditions are curated starting points; lunar, religious, and region-specific observances require local verification before publishing definitive event details.

- Expanded each hub with a browser-local live countdown for fixed-date annual observances; movable and lunar observances deliberately show a verification notice instead of a potentially misleading timer.
- Replaced CSS-only moodboards with real Wikimedia Commons photographs fetched at runtime. The page only displays public-domain, CC0, or commercial-use-compatible CC BY/CC BY-SA images and shows creator, license, and source links; if no suitable photo is found, it shows a Commons search link instead.
- Added holiday-specific activity prompts and recipe inspiration across the curated hub collection, including contextual notes for cultural and religious observances. Recipes remain inspiration, with exact quantities and cooking directions delegated to tested sources.
- Added source links to Washington OSPI, OPM, the United Nations, and Washington State University for date checking. Fixed-weekday US holidays and Western Easter use explicit calendar rules; lunar, Hebrew-calendar, and local astronomical dates remain paused for local verification.
- The media and event tools are discovery links, not a licensed media library or verified event feed. Confirm rights, dates, and organizer details before publishing or attending.


## V3.0 — connected holiday experience
- Rebuilt the home page around a cinematic editorial dashboard and searchable discovery cards.
- Added `traditions.html` as a searchable, context-first directory over the curated holiday hub dataset.
- Added `planner.html`, a private-by-default celebration checklist with dates, categories, completion state, and JSON export. Planner data stays in the visitor's browser local storage; it is not uploaded.
- Added `assets/css/v3.css` for responsive V3 components, focus-visible states, and reduced-motion behavior.
- Added `assets/js/v3.js` for discovery filtering, live local date display, and planner interactions.
- Updated the existing calendar, hub directory, hub detail, countdown, activities, and Santa pages with V3 styling and navigation.
- Kept the static HTML/CSS/JavaScript architecture and avoided adding client-side API keys or implying that demo-only services are live.
- Image search results remain candidates until human review. Measured recipe drafts are not marked kitchen-tested without a real cook test. Lunar and other locally variable observances remain paused until source-backed verification.

### Run and validate
Open `index.html` or serve the repository directory with any static HTTP server. The site does not require a build step. GitHub Actions checks JavaScript syntax and local HTML references. Browser storage is used only by the optional planner and is specific to that browser/device.


## V3.1 — Seasonal Experience Studio
- Added experiences.html with twelve adaptable seasonal experiences across spring, summer, autumn and winter.
- Added season filters, expandable steps and accessibility adaptations, browser-local saved ideas, and a planner handoff carrying the selected idea.
- Connected the experience studio from the homepage and activities page.
- Expanded the photography review manifest schema and documented an intake, licensing, cultural review, accessibility and local image optimization workflow in docs/PHOTOGRAPHY-PRODUCTION.md.
- Photography assets remain intentionally unpublished until provenance, licensing, cultural context, accessibility and optimization review are complete. The manifest is empty by design.
- Extended the Chromium CI suite to exercise seasonal filters, saved ideas, planner handoff, date calculations, responsive navigation and planner task persistence.


## V3.2 — cinematic photography rollout
- Reworked holiday detail heroes into responsive, photo-led editorial stages with a cinematic local fallback when no approved photo exists.
- Added an accessible local gallery renderer that reads only approved items from the photo review manifest, uses AVIF/WebP/JPEG fallbacks and responsive srcsets, and displays creator/license credits.
- Disabled runtime display of unreviewed Wikimedia search candidates; a Commons search link remains available as a research starting point, not as approved site imagery.
- Added a Sharp-based local optimization script and editorial intake, rights, cultural-context, alt-text and performance review workflow.
- The manifest remains empty until source photographs are actually reviewed and added. The implementation is ready, but no approved local photo library is claimed yet.

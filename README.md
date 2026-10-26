# CrowRules Holiday Hub
**One Company. One Universe. Every Holiday Has a Story.**

A responsive, multi-page holiday discovery experience from CrowRules Entertainment. This first release establishes the shared design system and core pages before larger features are added.

## Pages
- `index.html` — cinematic homepage
- `holidays.html` — searchable holiday directory
- `calendar.html` — month-by-month world holiday guide with a separate list of dates that change each year
- `holiday.html` — reusable holiday detail template (reads `?id=`)
- `christmas.html` — year-round Christmas and North Pole hub
- `nativity.html` — Christian Christmas and the Nativity
- `tradition-builder.html` — create a personal tradition locally in the browser
- `kitchen.html` — Mr. Claus's Kitchen recipe collection
- `auth.html` — Supabase account creation, email/password sign-in, social OAuth, password recovery, and membership status

## Run locally
Open `index.html` in a browser, or serve the repository with any static web server. No build step is required.

## Design and implementation
- Semantic HTML, responsive CSS, and vanilla JavaScript
- Holiday data is centralized in `assets/js/holidays.js`
- Search and tradition builder work client-side
- External images are loaded from Unsplash URLs; replace with owned/licensed assets before production
- Supabase Auth powers email/password sign-in, account creation, password recovery, and configured Google, Apple, Discord, and GitHub OAuth providers
- The account page calls the existing authenticated `membership-status` Edge Function to read membership and Holiday Hub entitlement information
- Social providers require their own OAuth client credentials and must be enabled in Supabase before those buttons can complete sign-in
- Accounts from different social providers are not automatically merged; account linking must be configured and tested separately

## Next milestones
1. Expand and fact-check the holiday library with reputable sources.
2. Add accessible date handling and regional calendar variations.
3. Configure Supabase with Row Level Security before adding accounts or submissions.
4. Add letter-to-Santa workflow, recipe detail pages, and a simulated 3D Santa tracker.
5. Add automated accessibility, responsive, and link checks.

## Calendar note
The World Calendar is an introductory month-by-month guide, not a year-specific date calculator. Lunar, lunisolar, religious, and moveable observances are flagged as date-variable; users should confirm dates with trusted local or community sources.

## Important content note
December 25 is celebrated by many Christians as the Nativity of Jesus Christ; the exact historical date of Jesus's birth is not known. Some Christian communities celebrate Christmas on a different civil-calendar date because of calendar traditions. The Nativity page distinguishes biblical accounts from later customs and from the fictional North Pole experience.

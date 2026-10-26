# CrowRules Holiday Hub

A cinematic, year-round holiday universe from CrowRules Entertainment. Built as a static, multi-page HTML/CSS/JavaScript site, ready for GitHub Pages and a Supabase-backed member experience.

## Pages
- `index.html` — cinematic home, seasonal discovery and featured experiences
- `holidays.html` — searchable holiday directory
- `holiday.html?slug=christmas` — reusable dedicated holiday detail page
- `north-pole.html` — year-round North Pole dispatches and workshop stories
- `letters.html` — Santa letter-writing experience
- `kitchen.html` — Mr. Claus's Kitchen recipe collection
- `traditions.html` — create and save new traditions
- `tracker.html` — fictional Christmas Eve route simulation
- `membership.html` — Universal CrowRules Membership sign-in and sign-up

## Run locally
Open `index.html` directly, or serve the repository folder with any static HTTP server. No build step is required.

## GitHub Pages
In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. The site entry point is `index.html`.

## Supabase setup
1. Open your Supabase project SQL Editor.
2. Review and run `supabase/schema.sql`.
3. In Supabase Authentication, configure your site URL and redirect URLs.
4. Configure the providers you want to offer (for example Google or Apple) in Supabase and their provider consoles.
5. Open `assets/js/supabase-config.js` and enter your project URL and publishable/anon key. These are browser-safe values when RLS is correctly configured. **Never put a service-role or secret key in this file.**
6. If configuration is absent, the site stays in demo mode and clearly identifies that state.

The supplied CrowUniverse logo is referenced from the existing public Supabase Storage URL. Replace the URL only if you have a new approved asset location.

## Security notes
- Public holiday editorial content is separate from private member records.
- RLS policies in the SQL schema scope member-owned rows to `auth.uid()`.
- Letter submissions are private by default. Do not publish user letters or child information.
- Santa replies in this concept are fictional holiday entertainment.
- Never expose Supabase service-role keys in client code. Add server-side moderation/rate limiting before enabling AI-generated replies in production.
- Verify Supabase Data API grants and RLS in your own project before launch.

## Included vs. requires configuration
The visual site, holiday directory, page routing, filters, tradition builder, recipe interactions, demo letter workflow and simulated tracker are included. Real account access and member-saved records activate only after valid Supabase configuration and schema deployment. Social sign-in also requires provider setup. The Santa route is explicitly fictional, not real-world tracking.

## Structure
```
assets/css/styles.css
assets/js/app.js
assets/js/supabase-config.js
supabase/schema.sql
supabase/functions/santa-reply/index.ts
```

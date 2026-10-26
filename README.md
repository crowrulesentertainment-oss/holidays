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
A GitHub Actions workflow is included at `.github/workflows/pages.yml`. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Save, then check the **Actions** tab for the deployment result. The workflow deploys the repository root; the site entry point is `index.html`.

## Supabase setup
1. The Holiday Hub is configured to use the existing CrowRules Supabase project through `assets/js/supabase-config.js`, using its browser-safe publishable key. Never put a service-role or secret key in this file.
2. The additive migration `supabase/migrations/20261025000000_holiday_hub_member_features.sql` creates the member tables used by this site without replacing the existing CrowRules holiday catalog or Universal Membership tables. It has been applied to the connected project.
3. In Supabase Authentication, configure the site URL and allowed redirect URLs for the deployed GitHub Pages URL and local testing.
4. Configure Google and Apple OAuth in Supabase and their provider consoles before enabling those buttons in production.
5. If configuration is absent, the site stays in demo mode. Real account access requires the site's URL to be listed in Supabase Auth redirect settings.

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

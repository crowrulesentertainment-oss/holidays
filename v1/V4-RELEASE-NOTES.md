# CrowRules Entertainment Holiday Hub — Upgrade v4

## Included
- Santa conversation demo with speech synthesis and optional browser speech recognition.
- Live annual holiday countdown calendar.
- Private member photo gallery using short-lived signed URLs.
- Browser reminder preference page and a scheduled-email Edge Function dry-run starter.
- SQL additions for a holiday calendar, reminder preferences, notification log, and private photo bucket.

## Setup
1. Keep existing v2/v3 files and configuration.
2. Configure `js/supabase-config.js` with your project URL and publishable key (never service-role keys in browser code).
3. Apply `supabase/v4-migration.sql` after reviewing it against your current schema and admin table.
4. Host the site over HTTPS for microphone/browser notification support.
5. For actual scheduled email, deploy the Edge Function, configure secrets server-side, implement verified recipient lookup + dedupe + email sending, and configure a scheduler. Included function is dry-run only.

## Limitations
- Santa replies are rule-based local demo text, not a live AI conversation, human, or photorealistic video avatar.
- Browser speech recognition depends on browser support and permission.
- Holiday calendar is a curated starter list, not an externally managed calendar yet.
- Birthday email notifications are not sent by default. The included Edge Function intentionally returns dry-run results only.
- Photo gallery requires Supabase auth, storage bucket and RLS policies.

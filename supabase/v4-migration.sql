-- CrowRules Holiday Hub v4 additions. Review against your existing schema before applying.
create table if not exists public.holiday_calendar_events (
 id uuid primary key default gen_random_uuid(), title text not null, description text not null default '', event_date date not null,
 category text not null default 'holiday', is_published boolean not null default false, is_featured boolean not null default false,
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.holiday_reminder_preferences (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 birthday_date date, birthday_name text, email_opt_in boolean not null default false, timezone text not null default 'America/Los_Angeles',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id)
);
create table if not exists public.holiday_notification_log (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
 reminder_key text not null, sent_at timestamptz not null default now(), provider_message_id text, unique(user_id, reminder_key)
);
alter table public.holiday_calendar_events enable row level security;
alter table public.holiday_reminder_preferences enable row level security;
alter table public.holiday_notification_log enable row level security;
drop policy if exists "Public can read published holiday calendar events" on public.holiday_calendar_events;
create policy "Public can read published holiday calendar events" on public.holiday_calendar_events for select using (is_published = true);
drop policy if exists "Admins manage holiday calendar events" on public.holiday_calendar_events;
create policy "Admins manage holiday calendar events" on public.holiday_calendar_events for all to authenticated using (exists(select 1 from public.holiday_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.holiday_admins a where a.user_id=auth.uid()));
drop policy if exists "Members manage own reminder preferences" on public.holiday_reminder_preferences;
create policy "Members manage own reminder preferences" on public.holiday_reminder_preferences for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "Members read own notification log" on public.holiday_notification_log;
create policy "Members read own notification log" on public.holiday_notification_log for select to authenticated using (user_id=auth.uid());
-- Storage bucket for member photos. Private bucket; signed URLs are short-lived.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('holiday-memory-photos','holiday-memory-photos',false,6291456,array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public=false,file_size_limit=6291456,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Members upload photos into own folder" on storage.objects;
create policy "Members upload photos into own folder" on storage.objects for insert to authenticated with check (bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Members read photos in own folder" on storage.objects;
create policy "Members read photos in own folder" on storage.objects for select to authenticated using (bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Members update photos in own folder" on storage.objects;
create policy "Members update photos in own folder" on storage.objects for update to authenticated using (bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Members delete photos in own folder" on storage.objects;
create policy "Members delete photos in own folder" on storage.objects for delete to authenticated using (bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);

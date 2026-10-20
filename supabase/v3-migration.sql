-- CrowRules Holiday Hub v3 migration. Run once in Supabase SQL Editor.
-- Review before production deployment. No service-role key belongs in browser code.
create extension if not exists pgcrypto;

-- Stable client IDs make repeated syncs idempotent instead of creating duplicates.
alter table public.holiday_letters add column if not exists local_id text;
alter table public.holiday_traditions add column if not exists local_id text;
alter table public.holiday_memories add column if not exists local_id text;
create unique index if not exists holiday_letters_user_local_id_uq on public.holiday_letters(user_id,local_id);
create unique index if not exists holiday_traditions_user_local_id_uq on public.holiday_traditions(user_id,local_id);
create unique index if not exists holiday_memories_user_local_id_uq on public.holiday_memories(user_id,local_id);

create table if not exists public.holiday_admins(user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
alter table public.holiday_admins enable row level security;
revoke all on public.holiday_admins from anon, authenticated;
-- Add an administrator manually from the SQL editor only, after a member has signed up:
-- insert into public.holiday_admins(user_id) select id from auth.users where email='YOUR-ADMIN-EMAIL';

create or replace function public.is_holiday_admin() returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.holiday_admins where user_id=auth.uid()) $$;
revoke all on function public.is_holiday_admin() from public;
grant execute on function public.is_holiday_admin() to anon, authenticated;

create table if not exists public.holiday_announcements(
 id uuid primary key default gen_random_uuid(), title text not null check(char_length(title) between 1 and 140),
 body text not null check(char_length(body) between 1 and 5000), category text not null default 'Holiday News',
 is_featured boolean not null default false, published_at timestamptz not null default now(), expires_at date,
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
alter table public.holiday_announcements enable row level security;
drop policy if exists "Public can read current holiday announcements" on public.holiday_announcements;
drop policy if exists "Admins manage holiday announcements" on public.holiday_announcements;
create policy "Public can read current holiday announcements" on public.holiday_announcements for select to anon,authenticated using(expires_at is null or expires_at >= current_date);
create policy "Admins manage holiday announcements" on public.holiday_announcements for all to authenticated using(public.is_holiday_admin()) with check(public.is_holiday_admin());

-- Private photo storage. Object paths must begin with the authenticated user's UUID.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('holiday-memory-photos','holiday-memory-photos',false,6291456,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=6291456,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Members upload own holiday memory photos" on storage.objects;
drop policy if exists "Members read own holiday memory photos" on storage.objects;
drop policy if exists "Members delete own holiday memory photos" on storage.objects;
create policy "Members upload own holiday memory photos" on storage.objects for insert to authenticated with check(bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Members read own holiday memory photos" on storage.objects for select to authenticated using(bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Members delete own holiday memory photos" on storage.objects for delete to authenticated using(bucket_id='holiday-memory-photos' and (storage.foldername(name))[1]=auth.uid()::text);

-- Ensure core content tables use RLS and owner checks. Existing v2 owner policies remain in place.
alter table public.holiday_letters enable row level security;
alter table public.holiday_traditions enable row level security;
alter table public.holiday_memories enable row level security;

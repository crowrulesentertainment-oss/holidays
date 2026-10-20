-- CrowRules Holiday Hub starter schema. Review in development before deployment.
create extension if not exists pgcrypto;
create table if not exists public.holiday_profiles(id uuid primary key references auth.users(id) on delete cascade, display_name text, birthday date, created_at timestamptz not null default now());
create table if not exists public.holiday_letters(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, display_name text not null default '', message text not null check(char_length(message)<=4000), kindness_note text not null default '', created_at timestamptz not null default now());
create table if not exists public.holiday_traditions(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, holiday_name text not null default 'All occasions', title text not null, description text not null, schedule_note text not null default '', is_public boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.holiday_memories(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, holiday_name text not null default 'Everyday magic', title text not null, story text not null, people_note text not null default '', memory_date date, media_path text, is_public boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.holiday_birthday_messages(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recipient_name text not null, recipient_birthday date, message text not null, delivery_status text not null default 'draft' check(delivery_status in ('draft','queued','sent','failed')), created_at timestamptz not null default now());
alter table public.holiday_profiles enable row level security; alter table public.holiday_letters enable row level security; alter table public.holiday_traditions enable row level security; alter table public.holiday_memories enable row level security; alter table public.holiday_birthday_messages enable row level security;
create policy "Own profile select" on public.holiday_profiles for select to authenticated using(auth.uid()=id);
create policy "Own profile insert" on public.holiday_profiles for insert to authenticated with check(auth.uid()=id);
create policy "Own profile update" on public.holiday_profiles for update to authenticated using(auth.uid()=id) with check(auth.uid()=id);
create policy "Own letters all" on public.holiday_letters for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "Own or public traditions select" on public.holiday_traditions for select to authenticated using(auth.uid()=user_id or is_public=true);
create policy "Own traditions insert" on public.holiday_traditions for insert to authenticated with check(auth.uid()=user_id);
create policy "Own traditions update" on public.holiday_traditions for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "Own traditions delete" on public.holiday_traditions for delete to authenticated using(auth.uid()=user_id);
create policy "Own or public memories select" on public.holiday_memories for select to authenticated using(auth.uid()=user_id or is_public=true);
create policy "Own memories insert" on public.holiday_memories for insert to authenticated with check(auth.uid()=user_id);
create policy "Own memories update" on public.holiday_memories for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "Own memories delete" on public.holiday_memories for delete to authenticated using(auth.uid()=user_id);
create policy "Own birthday messages all" on public.holiday_birthday_messages for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
-- Add Storage bucket policies separately if photo upload is enabled. Public access is closed by default.

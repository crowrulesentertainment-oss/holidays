-- CrowRules Holiday Hub member features; additive to the existing CrowRules Supabase project.
-- Private member rows are restricted to auth.uid(). Replies are server/admin-created only.
create extension if not exists pgcrypto;

create table if not exists public.saved_holidays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  holiday_slug text not null check (char_length(holiday_slug) between 1 and 120),
  created_at timestamptz not null default now(),
  unique(user_id, holiday_slug)
);
alter table public.saved_holidays enable row level security;
drop policy if exists "Holiday Hub saved holidays owner access" on public.saved_holidays;
create policy "Holiday Hub saved holidays owner access" on public.saved_holidays for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.saved_holidays to authenticated;

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_name text not null check (char_length(recipe_name) between 1 and 160),
  notes text not null default '' check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  unique(user_id, recipe_name)
);
alter table public.saved_recipes enable row level security;
drop policy if exists "Holiday Hub saved recipes owner access" on public.saved_recipes;
create policy "Holiday Hub saved recipes owner access" on public.saved_recipes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.saved_recipes to authenticated;

create table if not exists public.member_traditions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  holiday text not null default 'Any day' check (char_length(holiday) <= 120),
  frequency text not null default 'Every year' check (char_length(frequency) <= 60),
  audience text not null default 'Family and household' check (char_length(audience) <= 100),
  instructions text not null check (char_length(instructions) between 1 and 3000),
  memory_prompt text not null default '' check (char_length(memory_prompt) <= 1000),
  visibility text not null default 'private' check (visibility in ('private','household')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.member_traditions enable row level security;
drop policy if exists "Holiday Hub traditions owner access" on public.member_traditions;
create policy "Holiday Hub traditions owner access" on public.member_traditions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.member_traditions to authenticated;

create table if not exists public.santa_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'received' check (status in ('draft','received','in_review','reply_ready','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.santa_letters enable row level security;
drop policy if exists "Holiday Hub letters owner access" on public.santa_letters;
create policy "Holiday Hub letters owner access" on public.santa_letters for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.santa_letters to authenticated;

create table if not exists public.santa_replies (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.santa_letters(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reply_text text not null check (char_length(reply_text) between 1 and 5000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.santa_replies enable row level security;
drop policy if exists "Holiday Hub replies owner read only" on public.santa_replies;
create policy "Holiday Hub replies owner read only" on public.santa_replies for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.santa_replies to authenticated;
revoke insert, update, delete on public.santa_replies from anon, authenticated;

create index if not exists saved_holidays_user_created_idx on public.saved_holidays(user_id, created_at desc);
create index if not exists saved_recipes_user_created_idx on public.saved_recipes(user_id, created_at desc);
create index if not exists member_traditions_user_created_idx on public.member_traditions(user_id, created_at desc);
create index if not exists santa_letters_user_created_idx on public.santa_letters(user_id, created_at desc);
create index if not exists santa_replies_user_created_idx on public.santa_replies(user_id, created_at desc);

-- CrowRules Holiday Hub starter schema
-- Review before applying to a live project. Every exposed table enables RLS.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles readable by owner" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Profiles insertable by owner" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Profiles updatable by owner" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create table if not exists public.member_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorite_holidays text[] not null default '{}',
  language_code text not null default 'en',
  reminders_enabled boolean not null default false,
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.member_preferences enable row level security;
create policy "Preferences owned by member" on public.member_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.saved_holidays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  holiday_slug text not null check (char_length(holiday_slug) <= 120),
  created_at timestamptz not null default now(),
  unique(user_id, holiday_slug)
);
alter table public.saved_holidays enable row level security;
create policy "Saved holidays owned by member" on public.saved_holidays for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

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
create policy "Traditions owned by member" on public.member_traditions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.tradition_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tradition_id uuid references public.member_traditions(id) on delete set null,
  memory_year integer check (memory_year between 1900 and 2200),
  note text not null default '' check (char_length(note) <= 5000),
  media_path text,
  created_at timestamptz not null default now()
);
alter table public.tradition_memories enable row level security;
create policy "Memories owned by member" on public.tradition_memories for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_name text not null check (char_length(recipe_name) between 1 and 160),
  notes text not null default '' check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  unique(user_id, recipe_name)
);
alter table public.saved_recipes enable row level security;
create policy "Saved recipes owned by member" on public.saved_recipes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

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
create policy "Santa letters owned by member" on public.santa_letters for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.santa_replies (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.santa_letters(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reply_text text not null check (char_length(reply_text) between 1 and 5000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.santa_replies enable row level security;
create policy "Santa replies readable by owner" on public.santa_replies for select to authenticated using ((select auth.uid()) = user_id);
-- Members cannot insert or edit replies directly; a trusted server-side workflow must create them.

create table if not exists public.holiday_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  holiday_slug text not null check (char_length(holiday_slug) <= 120),
  remind_on date not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.holiday_reminders enable row level security;
create policy "Reminders owned by member" on public.holiday_reminders for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Public editorial content is intentionally separate from private member tables.
create table if not exists public.holidays (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  short_description text not null default '',
  date_description text not null default '',
  season text not null default 'All year',
  category text not null default 'Cultural',
  published boolean not null default false,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.holidays enable row level security;
create policy "Published holidays are public" on public.holidays for select to anon, authenticated using (published = true);

create table if not exists public.north_pole_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  body text not null check (char_length(body) <= 12000),
  category text not null default 'dispatch',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.north_pole_updates enable row level security;
create policy "Published North Pole updates are public" on public.north_pole_updates for select to anon, authenticated using (published = true);

create table if not exists public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  submission_type text not null check (submission_type in ('holiday','tradition','recipe','story','correction')),
  title text not null check (char_length(title) between 1 and 180),
  body text not null check (char_length(body) between 1 and 8000),
  status text not null default 'pending' check (status in ('pending','in_review','accepted','declined')),
  created_at timestamptz not null default now()
);
alter table public.community_submissions enable row level security;
create policy "Members can view own submissions" on public.community_submissions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Members can submit as themselves" on public.community_submissions for insert to authenticated with check ((select auth.uid()) = user_id);
-- No client update/delete policy: review status is controlled by a trusted admin workflow.

-- Create/update a profile row when a new Auth user is registered.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- updated_at trigger helper (invoker; no elevated privileges).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists preferences_updated_at on public.member_preferences;
create trigger preferences_updated_at before update on public.member_preferences for each row execute procedure public.set_updated_at();
drop trigger if exists traditions_updated_at on public.member_traditions;
create trigger traditions_updated_at before update on public.member_traditions for each row execute procedure public.set_updated_at();
drop trigger if exists letters_updated_at on public.santa_letters;
create trigger letters_updated_at before update on public.santa_letters for each row execute procedure public.set_updated_at();
drop trigger if exists holidays_updated_at on public.holidays;
create trigger holidays_updated_at before update on public.holidays for each row execute procedure public.set_updated_at();

-- Note: create storage buckets and storage.objects policies separately after deciding
-- whether family photos are allowed. Keep private keepsake buckets private by default.

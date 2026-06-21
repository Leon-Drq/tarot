create table if not exists public.daily_tarot_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  card_id integer not null,
  card_name text not null,
  is_reversed boolean not null default false,
  question text not null default 'What guidance do I need today?',
  interpretation text,
  journal text,
  mood text,
  streak_count integer not null default 1 check (streak_count >= 1),
  reminder_enabled boolean not null default false,
  reminder_email text,
  reminder_time text not null default '08:30',
  reminder_timezone text not null default 'UTC',
  source text not null default 'daily-tarot',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists daily_tarot_entries_user_date_idx
on public.daily_tarot_entries (user_id, entry_date desc);

create index if not exists daily_tarot_entries_reminder_idx
on public.daily_tarot_entries (reminder_enabled, reminder_time)
where reminder_enabled = true;

alter table public.daily_tarot_entries enable row level security;

revoke all on table public.daily_tarot_entries from anon, authenticated;
grant select, insert, update on table public.daily_tarot_entries to authenticated;
grant select, insert, update, delete on table public.daily_tarot_entries to service_role;

drop policy if exists "Users can read own daily tarot entries" on public.daily_tarot_entries;
create policy "Users can read own daily tarot entries"
on public.daily_tarot_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own daily tarot entries" on public.daily_tarot_entries;
create policy "Users can create own daily tarot entries"
on public.daily_tarot_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own daily tarot entries" on public.daily_tarot_entries;
create policy "Users can update own daily tarot entries"
on public.daily_tarot_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function private.touch_daily_tarot_entry()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_tarot_entries_touch_trigger on public.daily_tarot_entries;
create trigger daily_tarot_entries_touch_trigger
before update on public.daily_tarot_entries
for each row execute function private.touch_daily_tarot_entry();

revoke all on function private.touch_daily_tarot_entry() from public;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (
    event_name in (
      'page_view',
      'question_submitted',
      'cards_selected',
      'reading_completed',
      'share_created',
      'share_template_copied',
      'payment_started',
      'payment_completed'
    )
  ),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  path text not null default '/',
  locale text not null default 'en' check (locale in ('zh', 'en', 'ja', 'ko')),
  referrer text,
  source text,
  medium text,
  campaign text,
  keyword text,
  reading_id uuid references public.tarot_readings(id) on delete set null,
  share_slug text references public.reading_shares(slug) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);
create index if not exists analytics_events_source_idx on public.analytics_events (source);
create index if not exists analytics_events_keyword_idx on public.analytics_events (keyword) where keyword is not null;

alter table public.analytics_events enable row level security;

revoke all on table public.analytics_events from anon, authenticated;
grant insert on table public.analytics_events to anon, authenticated;
grant select, insert, update, delete on table public.analytics_events to service_role;

drop policy if exists "Anonymous users can record analytics events" on public.analytics_events;
create policy "Anonymous users can record analytics events"
on public.analytics_events
for insert
to anon
with check (user_id is null);

drop policy if exists "Authenticated users can record analytics events" on public.analytics_events;
create policy "Authenticated users can record analytics events"
on public.analytics_events
for insert
to authenticated
with check (user_id is null or (select auth.uid()) = user_id);

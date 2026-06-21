create schema if not exists private;

create table if not exists public.analytics_daily_metrics (
  day date not null,
  source text not null default 'direct',
  keyword text not null default '',
  page_views integer not null default 0 check (page_views >= 0),
  sessions integer not null default 0 check (sessions >= 0),
  questions integer not null default 0 check (questions >= 0),
  cards_selected integer not null default 0 check (cards_selected >= 0),
  readings_completed integer not null default 0 check (readings_completed >= 0),
  shares_created integer not null default 0 check (shares_created >= 0),
  share_templates_copied integer not null default 0 check (share_templates_copied >= 0),
  payment_started integer not null default 0 check (payment_started >= 0),
  payment_completed integer not null default 0 check (payment_completed >= 0),
  updated_at timestamptz not null default now(),
  primary key (day, source, keyword)
);

create index if not exists analytics_daily_metrics_day_idx on public.analytics_daily_metrics (day desc);
create index if not exists analytics_daily_metrics_source_idx on public.analytics_daily_metrics (source);
create index if not exists analytics_daily_metrics_keyword_idx on public.analytics_daily_metrics (keyword) where keyword <> '';

create table if not exists private.analytics_daily_sessions (
  day date not null,
  session_id text not null,
  source text not null,
  keyword text not null,
  created_at timestamptz not null default now(),
  primary key (day, session_id, source, keyword)
);

create or replace function private.rollup_analytics_event()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  rollup_day date;
  rollup_source text;
  rollup_keyword text;
  rollup_session text;
  inserted_sessions integer := 0;
begin
  rollup_day := (new.created_at at time zone 'utc')::date;
  rollup_source := coalesce(nullif(left(btrim(new.source), 128), ''), 'direct');
  rollup_keyword := coalesce(left(btrim(new.keyword), 256), '');
  rollup_session := nullif(left(btrim(new.session_id), 96), '');

  insert into public.analytics_daily_metrics (day, source, keyword)
  values (rollup_day, rollup_source, rollup_keyword)
  on conflict (day, source, keyword) do nothing;

  if rollup_session is not null then
    insert into private.analytics_daily_sessions (day, session_id, source, keyword)
    values (rollup_day, rollup_session, rollup_source, rollup_keyword)
    on conflict do nothing;

    get diagnostics inserted_sessions = row_count;
  end if;

  update public.analytics_daily_metrics
  set
    page_views = page_views + case when new.event_name = 'page_view' then 1 else 0 end,
    sessions = sessions + inserted_sessions,
    questions = questions + case when new.event_name = 'question_submitted' then 1 else 0 end,
    cards_selected = cards_selected + case when new.event_name = 'cards_selected' then 1 else 0 end,
    readings_completed = readings_completed + case when new.event_name = 'reading_completed' then 1 else 0 end,
    shares_created = shares_created + case when new.event_name = 'share_created' then 1 else 0 end,
    share_templates_copied = share_templates_copied + case when new.event_name = 'share_template_copied' then 1 else 0 end,
    payment_started = payment_started + case when new.event_name = 'payment_started' then 1 else 0 end,
    payment_completed = payment_completed + case when new.event_name = 'payment_completed' then 1 else 0 end,
    updated_at = now()
  where day = rollup_day
    and source = rollup_source
    and keyword = rollup_keyword;

  return new;
end;
$$;

drop trigger if exists analytics_events_rollup_trigger on public.analytics_events;
create trigger analytics_events_rollup_trigger
after insert on public.analytics_events
for each row execute function private.rollup_analytics_event();

insert into private.analytics_daily_sessions (day, session_id, source, keyword)
select distinct
  (created_at at time zone 'utc')::date as day,
  left(btrim(session_id), 96) as session_id,
  coalesce(nullif(left(btrim(source), 128), ''), 'direct') as source,
  coalesce(left(btrim(keyword), 256), '') as keyword
from public.analytics_events
where nullif(left(btrim(session_id), 96), '') is not null
on conflict do nothing;

with event_rows as (
  select
    (created_at at time zone 'utc')::date as day,
    coalesce(nullif(left(btrim(source), 128), ''), 'direct') as source,
    coalesce(left(btrim(keyword), 256), '') as keyword,
    event_name,
    nullif(left(btrim(session_id), 96), '') as session_id
  from public.analytics_events
)
insert into public.analytics_daily_metrics (
  day,
  source,
  keyword,
  page_views,
  sessions,
  questions,
  cards_selected,
  readings_completed,
  shares_created,
  share_templates_copied,
  payment_started,
  payment_completed
)
select
  day,
  source,
  keyword,
  count(*) filter (where event_name = 'page_view')::integer,
  count(distinct session_id) filter (where session_id is not null)::integer,
  count(*) filter (where event_name = 'question_submitted')::integer,
  count(*) filter (where event_name = 'cards_selected')::integer,
  count(*) filter (where event_name = 'reading_completed')::integer,
  count(*) filter (where event_name = 'share_created')::integer,
  count(*) filter (where event_name = 'share_template_copied')::integer,
  count(*) filter (where event_name = 'payment_started')::integer,
  count(*) filter (where event_name = 'payment_completed')::integer
from event_rows
group by day, source, keyword
on conflict (day, source, keyword) do update
set
  page_views = excluded.page_views,
  sessions = excluded.sessions,
  questions = excluded.questions,
  cards_selected = excluded.cards_selected,
  readings_completed = excluded.readings_completed,
  shares_created = excluded.shares_created,
  share_templates_copied = excluded.share_templates_copied,
  payment_started = excluded.payment_started,
  payment_completed = excluded.payment_completed,
  updated_at = now();

alter table public.analytics_daily_metrics enable row level security;

revoke all on table public.analytics_daily_metrics from anon, authenticated;
grant select on table public.analytics_daily_metrics to authenticated;
grant select, insert, update, delete on table public.analytics_daily_metrics to service_role;

revoke all on schema private from public;
revoke all on table private.analytics_daily_sessions from anon, authenticated;
grant usage on schema private to service_role;
grant select, insert, update, delete on table private.analytics_daily_sessions to service_role;
revoke all on function private.rollup_analytics_event() from public;

drop policy if exists "Authenticated users can read aggregate analytics" on public.analytics_daily_metrics;
create policy "Authenticated users can read aggregate analytics"
on public.analytics_daily_metrics
for select
to authenticated
using (true);

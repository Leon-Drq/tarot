create schema if not exists private;

create table if not exists private.app_secret_hashes (
  name text primary key,
  secret_sha256 text not null check (secret_sha256 ~ '^[a-f0-9]{64}$'),
  updated_at timestamptz not null default now()
);

revoke all on table private.app_secret_hashes from anon, authenticated;
grant select, insert, update, delete on table private.app_secret_hashes to service_role;

create or replace function private.verify_app_secret(p_name text, p_secret text)
returns boolean
language sql
security definer
set search_path = private, extensions, public
as $$
  select exists (
    select 1
    from private.app_secret_hashes
    where name = p_name
      and secret_sha256 = encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex')
  );
$$;

revoke all on function private.verify_app_secret(text, text) from public;

create or replace function private.daily_tarot_reminder_database_ready(p_secret text)
returns boolean
language sql
security definer
set search_path = private, extensions, public
as $$
  select private.verify_app_secret('daily_reminder_cron', p_secret);
$$;

revoke all on function private.daily_tarot_reminder_database_ready(text) from public;

create or replace function private.daily_tarot_reminder_candidates(p_secret text, p_limit integer default 2000)
returns table (
  id uuid,
  user_id uuid,
  entry_date date,
  card_name text,
  is_reversed boolean,
  streak_count integer,
  reminder_email text,
  reminder_time text,
  reminder_timezone text,
  reminder_last_sent_on date,
  reminder_send_count integer
)
language plpgsql
security definer
set search_path = public, private, extensions
as $$
begin
  if not private.verify_app_secret('daily_reminder_cron', p_secret) then
    raise exception 'invalid reminder secret' using errcode = '28000';
  end if;

  return query
  select
    newest.id,
    newest.user_id,
    newest.entry_date,
    newest.card_name,
    newest.is_reversed,
    newest.streak_count,
    newest.reminder_email,
    newest.reminder_time,
    newest.reminder_timezone,
    newest.reminder_last_sent_on,
    coalesce(newest.reminder_send_count, 0) as reminder_send_count
  from (
    select distinct on (entry.user_id)
      entry.id,
      entry.user_id,
      entry.entry_date,
      entry.card_name,
      entry.is_reversed,
      entry.streak_count,
      entry.reminder_email,
      entry.reminder_time,
      entry.reminder_timezone,
      entry.reminder_last_sent_on,
      entry.reminder_send_count,
      entry.updated_at
    from public.daily_tarot_entries entry
    where entry.reminder_enabled = true
      and entry.reminder_email is not null
      and btrim(entry.reminder_email) <> ''
    order by entry.user_id, entry.entry_date desc, entry.updated_at desc
  ) newest
  order by newest.entry_date desc, newest.updated_at desc
  limit least(greatest(coalesce(p_limit, 2000), 0), 5000);
end;
$$;

revoke all on function private.daily_tarot_reminder_candidates(text, integer) from public;

create or replace function private.mark_daily_tarot_reminder_sent(p_secret text, p_entry_id uuid, p_sent_on date)
returns boolean
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  updated_count integer;
begin
  if not private.verify_app_secret('daily_reminder_cron', p_secret) then
    raise exception 'invalid reminder secret' using errcode = '28000';
  end if;

  update public.daily_tarot_entries
  set
    reminder_last_sent_on = p_sent_on,
    reminder_last_sent_at = now(),
    reminder_last_error = null,
    reminder_send_count = coalesce(reminder_send_count, 0) + 1
  where id = p_entry_id;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

revoke all on function private.mark_daily_tarot_reminder_sent(text, uuid, date) from public;

create or replace function private.mark_daily_tarot_reminder_failed(p_secret text, p_entry_id uuid, p_error text)
returns boolean
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  updated_count integer;
begin
  if not private.verify_app_secret('daily_reminder_cron', p_secret) then
    raise exception 'invalid reminder secret' using errcode = '28000';
  end if;

  update public.daily_tarot_entries
  set reminder_last_error = left(coalesce(p_error, 'Unknown email error'), 500)
  where id = p_entry_id;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

revoke all on function private.mark_daily_tarot_reminder_failed(text, uuid, text) from public;

grant usage on schema private to anon, authenticated;
grant execute on function private.daily_tarot_reminder_database_ready(text) to anon, authenticated;
grant execute on function private.daily_tarot_reminder_candidates(text, integer) to anon, authenticated;
grant execute on function private.mark_daily_tarot_reminder_sent(text, uuid, date) to anon, authenticated;
grant execute on function private.mark_daily_tarot_reminder_failed(text, uuid, text) to anon, authenticated;

create or replace function public.daily_tarot_reminder_database_ready(p_secret text)
returns boolean
language sql
security invoker
set search_path = public, private
as $$
  select private.daily_tarot_reminder_database_ready(p_secret);
$$;

create or replace function public.daily_tarot_reminder_candidates(p_secret text, p_limit integer default 2000)
returns table (
  id uuid,
  user_id uuid,
  entry_date date,
  card_name text,
  is_reversed boolean,
  streak_count integer,
  reminder_email text,
  reminder_time text,
  reminder_timezone text,
  reminder_last_sent_on date,
  reminder_send_count integer
)
language sql
security invoker
set search_path = public, private
as $$
  select *
  from private.daily_tarot_reminder_candidates(p_secret, p_limit);
$$;

create or replace function public.mark_daily_tarot_reminder_sent(p_secret text, p_entry_id uuid, p_sent_on date)
returns boolean
language sql
security invoker
set search_path = public, private
as $$
  select private.mark_daily_tarot_reminder_sent(p_secret, p_entry_id, p_sent_on);
$$;

create or replace function public.mark_daily_tarot_reminder_failed(p_secret text, p_entry_id uuid, p_error text)
returns boolean
language sql
security invoker
set search_path = public, private
as $$
  select private.mark_daily_tarot_reminder_failed(p_secret, p_entry_id, p_error);
$$;

revoke all on function public.daily_tarot_reminder_database_ready(text) from public;
revoke all on function public.daily_tarot_reminder_candidates(text, integer) from public;
revoke all on function public.mark_daily_tarot_reminder_sent(text, uuid, date) from public;
revoke all on function public.mark_daily_tarot_reminder_failed(text, uuid, text) from public;

grant execute on function public.daily_tarot_reminder_database_ready(text) to anon, authenticated;
grant execute on function public.daily_tarot_reminder_candidates(text, integer) to anon, authenticated;
grant execute on function public.mark_daily_tarot_reminder_sent(text, uuid, date) to anon, authenticated;
grant execute on function public.mark_daily_tarot_reminder_failed(text, uuid, text) to anon, authenticated;

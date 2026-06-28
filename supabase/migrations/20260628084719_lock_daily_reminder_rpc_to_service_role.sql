-- Reminder RPC calls are only used by trusted Next.js server routes.
-- Keep the secret checks inside the functions, but remove the extra public
-- execution surface that Supabase flags for SECURITY DEFINER wrappers.

create or replace function public.daily_tarot_reminder_database_ready(p_secret text)
returns boolean
language sql
security invoker
set search_path = public, private, extensions
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
set search_path = public, private, extensions
as $$
  select *
  from private.daily_tarot_reminder_candidates(p_secret, p_limit);
$$;

create or replace function public.mark_daily_tarot_reminder_sent(p_secret text, p_entry_id uuid, p_sent_on date)
returns boolean
language sql
security invoker
set search_path = public, private, extensions
as $$
  select private.mark_daily_tarot_reminder_sent(p_secret, p_entry_id, p_sent_on);
$$;

create or replace function public.mark_daily_tarot_reminder_failed(p_secret text, p_entry_id uuid, p_error text)
returns boolean
language sql
security invoker
set search_path = public, private, extensions
as $$
  select private.mark_daily_tarot_reminder_failed(p_secret, p_entry_id, p_error);
$$;

create or replace function public.disable_daily_tarot_reminders(p_secret text, p_user_id uuid)
returns integer
language sql
security invoker
set search_path = public, private, extensions
as $$
  select private.disable_daily_tarot_reminders(p_secret, p_user_id);
$$;

revoke all on function public.daily_tarot_reminder_database_ready(text) from public, anon, authenticated;
revoke all on function public.daily_tarot_reminder_candidates(text, integer) from public, anon, authenticated;
revoke all on function public.mark_daily_tarot_reminder_sent(text, uuid, date) from public, anon, authenticated;
revoke all on function public.mark_daily_tarot_reminder_failed(text, uuid, text) from public, anon, authenticated;
revoke all on function public.disable_daily_tarot_reminders(text, uuid) from public, anon, authenticated;

revoke execute on function private.daily_tarot_reminder_database_ready(text) from public, anon, authenticated;
revoke execute on function private.daily_tarot_reminder_candidates(text, integer) from public, anon, authenticated;
revoke execute on function private.mark_daily_tarot_reminder_sent(text, uuid, date) from public, anon, authenticated;
revoke execute on function private.mark_daily_tarot_reminder_failed(text, uuid, text) from public, anon, authenticated;
revoke execute on function private.disable_daily_tarot_reminders(text, uuid) from public, anon, authenticated;
revoke usage on schema private from anon, authenticated;

grant usage on schema private to service_role;
grant execute on function private.daily_tarot_reminder_database_ready(text) to service_role;
grant execute on function private.daily_tarot_reminder_candidates(text, integer) to service_role;
grant execute on function private.mark_daily_tarot_reminder_sent(text, uuid, date) to service_role;
grant execute on function private.mark_daily_tarot_reminder_failed(text, uuid, text) to service_role;
grant execute on function private.disable_daily_tarot_reminders(text, uuid) to service_role;

grant execute on function public.daily_tarot_reminder_database_ready(text) to service_role;
grant execute on function public.daily_tarot_reminder_candidates(text, integer) to service_role;
grant execute on function public.mark_daily_tarot_reminder_sent(text, uuid, date) to service_role;
grant execute on function public.mark_daily_tarot_reminder_failed(text, uuid, text) to service_role;
grant execute on function public.disable_daily_tarot_reminders(text, uuid) to service_role;

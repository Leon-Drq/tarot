create or replace function private.disable_daily_tarot_reminders(p_secret text, p_user_id uuid)
returns integer
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
    reminder_enabled = false,
    reminder_email = null,
    reminder_last_error = null
  where user_id = p_user_id
    and reminder_enabled = true;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

revoke all on function private.disable_daily_tarot_reminders(text, uuid) from public;
grant execute on function private.disable_daily_tarot_reminders(text, uuid) to anon, authenticated;

create or replace function public.disable_daily_tarot_reminders(p_secret text, p_user_id uuid)
returns integer
language sql
security invoker
set search_path = public, private
as $$
  select private.disable_daily_tarot_reminders(p_secret, p_user_id);
$$;

revoke all on function public.disable_daily_tarot_reminders(text, uuid) from public;
grant execute on function public.disable_daily_tarot_reminders(text, uuid) to anon, authenticated;

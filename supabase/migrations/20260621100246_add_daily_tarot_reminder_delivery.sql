alter table public.daily_tarot_entries
add column if not exists reminder_last_sent_on date,
add column if not exists reminder_last_sent_at timestamptz,
add column if not exists reminder_last_error text,
add column if not exists reminder_send_count integer not null default 0 check (reminder_send_count >= 0);

create index if not exists daily_tarot_entries_reminder_delivery_idx
on public.daily_tarot_entries (reminder_enabled, reminder_last_sent_on, reminder_time)
where reminder_enabled = true and reminder_email is not null;

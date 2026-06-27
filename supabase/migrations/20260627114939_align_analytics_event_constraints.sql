alter table public.analytics_events
drop constraint if exists analytics_events_event_name_check;

alter table public.analytics_events
add constraint analytics_events_event_name_check
check (
  event_name in (
    'page_view',
    'question_submitted',
    'cards_selected',
    'reading_completed',
    'share_created',
    'share_session_only',
    'share_template_copied',
    'reading_email_self_opened',
    'daily_calendar_reminder_downloaded',
    'daily_reminder_preference_saved',
    'daily_install_prompt_opened',
    'daily_install_completed',
    'daily_install_dismissed',
    'daily_install_fallback_shown',
    'payment_started',
    'payment_completed'
  )
);

alter table public.analytics_events
drop constraint if exists analytics_events_locale_check;

alter table public.analytics_events
add constraint analytics_events_locale_check
check (locale in ('zh', 'en', 'ja', 'ko', 'es', 'pt-br'));

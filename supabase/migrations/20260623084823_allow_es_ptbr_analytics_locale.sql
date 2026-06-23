alter table public.analytics_events
drop constraint if exists analytics_events_locale_check;

alter table public.analytics_events
add constraint analytics_events_locale_check
check (locale in ('zh', 'en', 'ja', 'ko', 'es', 'pt-br'));

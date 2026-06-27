create table if not exists public.reader_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  locale text not null default 'en' check (locale in ('zh', 'en', 'ja', 'ko', 'es', 'pt-br')),
  surface text not null default 'reviews' check (
    char_length(surface) between 1 and 80
    and surface ~ '^[a-z0-9_/-]+$'
  ),
  feedback_type text not null check (
    feedback_type in (
      'daily_tarot',
      'free_reading',
      'love_reading',
      'career_reading',
      'card_meanings',
      'trust_page',
      'other'
    )
  ),
  rating smallint not null check (rating between 1 and 5),
  quote text not null check (char_length(quote) between 12 and 800),
  permission_to_feature boolean not null default false,
  email text check (email is null or char_length(email) <= 254),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.reader_feedback is 'Private reader feedback submissions for editorial review before any public testimonial use.';
comment on column public.reader_feedback.permission_to_feature is 'True only when the reader allows POPTarot to quote the feedback after editorial review.';
comment on column public.reader_feedback.metadata is 'Privacy-limited request context such as path, referrer, and user agent for product analysis.';

create index if not exists reader_feedback_created_at_idx
  on public.reader_feedback (created_at desc);

create index if not exists reader_feedback_type_idx
  on public.reader_feedback (feedback_type, created_at desc);

create index if not exists reader_feedback_feature_permission_idx
  on public.reader_feedback (created_at desc)
  where permission_to_feature = true;

alter table public.reader_feedback enable row level security;

revoke all on table public.reader_feedback from anon, authenticated;
grant insert on table public.reader_feedback to anon, authenticated;
grant select, insert, update, delete on table public.reader_feedback to service_role;

drop policy if exists "Anonymous readers can submit feedback" on public.reader_feedback;
create policy "Anonymous readers can submit feedback"
on public.reader_feedback
for insert
to anon
with check (user_id is null);

drop policy if exists "Authenticated readers can submit own feedback" on public.reader_feedback;
create policy "Authenticated readers can submit own feedback"
on public.reader_feedback
for insert
to authenticated
with check (user_id is null or (select auth.uid()) = user_id);

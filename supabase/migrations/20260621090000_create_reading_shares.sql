create table if not exists public.reading_shares (
  slug text primary key check (slug ~ '^[a-z0-9-]{8,64}$'),
  reading_id uuid references public.tarot_readings(id) on delete set null,
  owner_id uuid references auth.users(id) on delete cascade not null,
  question text not null,
  cards jsonb not null default '[]'::jsonb,
  spread_type text not null default 'three_card',
  interpretation_excerpt text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists reading_shares_reading_id_key
  on public.reading_shares(reading_id)
  where reading_id is not null;

create index if not exists reading_shares_owner_id_idx
  on public.reading_shares(owner_id);

alter table public.reading_shares enable row level security;

grant select on public.reading_shares to anon, authenticated;
grant insert, update on public.reading_shares to authenticated;
grant select, insert, update, delete on public.reading_shares to service_role;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'reading_shares'
      and policyname = 'Anyone can read active reading shares'
  ) then
    create policy "Anyone can read active reading shares"
      on public.reading_shares
      for select
      to anon, authenticated
      using (is_active = true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'reading_shares'
      and policyname = 'Owners can create reading shares'
  ) then
    create policy "Owners can create reading shares"
      on public.reading_shares
      for insert
      to authenticated
      with check ((select auth.uid()) = owner_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'reading_shares'
      and policyname = 'Owners can update reading shares'
  ) then
    create policy "Owners can update reading shares"
      on public.reading_shares
      for update
      to authenticated
      using ((select auth.uid()) = owner_id)
      with check ((select auth.uid()) = owner_id);
  end if;
end $$;

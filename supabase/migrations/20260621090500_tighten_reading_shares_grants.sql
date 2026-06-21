revoke all on table public.reading_shares from anon, authenticated;

grant select on table public.reading_shares to anon;
grant select, insert, update on table public.reading_shares to authenticated;
grant select, insert, update, delete on table public.reading_shares to service_role;

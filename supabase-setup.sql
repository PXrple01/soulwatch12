-- =====================================================================
-- Einrichtung der Cloud für „Josefines und Johanns Watchlist“ (Supabase)
--
-- So geht's:
--   1. Unten in der letzten Anweisung  EUER-HAUSHALTS-CODE  durch euren Code ersetzen
--      (mindestens 4 Zeichen, z. B. ein Satz, den nur ihr kennt).
--   2. Im Supabase-Dashboard: SQL Editor → New query → alles einfügen → Run.
--   3. Den geänderten Code NICHT in GitHub speichern – diese Vorlage enthält bewusst nur den Platzhalter.
--
-- Das Skript kann gefahrlos mehrmals laufen (z. B. um später den Code zu ändern).
-- Die Tabellen sind von außen gesperrt; Lesen/Schreiben geht nur über die vier Funktionen mit dem Haushalts-Code.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- Haushalts-Code (nur als SHA-256-Prüfsumme gespeichert)
create table if not exists public.wl_household (
  id        int  primary key default 1 check (id = 1),
  code_hash text not null
);

-- Ein Eintrag pro Bereich: anime, film, serie und die Swipe-Abstimmung (vote)
create table if not exists public.wl_state (
  section    text        primary key check (section in ('anime','film','serie','vote')),
  data       jsonb       not null,
  updated_at timestamptz not null default clock_timestamp()
);

alter table public.wl_household enable row level security;
alter table public.wl_state     enable row level security;
revoke all on public.wl_household from anon, authenticated;
revoke all on public.wl_state     from anon, authenticated;

-- Prüft den Code; bei falschem Code bricht jede Funktion mit „invalid_code“ ab (die Seite erkennt das).
create or replace function public.wl_check(p_code text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_code is null or not exists (
    select 1 from public.wl_household
    where code_hash = encode(extensions.digest(p_code, 'sha256'), 'hex')
  ) then
    raise exception 'invalid_code';
  end if;
end $$;

-- Speichert einen Bereich. p_expected = Zeitstempel, den das Gerät zuletzt kannte.
-- Weicht er ab, gab es eine Änderung auf einem anderen Gerät → „conflict“ (die Seite lädt dann neu und versucht es erneut).
-- Gibt es den Bereich noch nicht, wird er angelegt.
create or replace function public.wl_save(p_section text, p_data jsonb, p_expected timestamptz) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare cur timestamptz; ts timestamptz := clock_timestamp();
begin
  if p_data is null or jsonb_typeof(p_data) <> 'object' then raise exception 'bad_data'; end if;
  if octet_length(p_data::text) > 4000000 then raise exception 'too_large'; end if;
  select updated_at into cur from public.wl_state where section = p_section for update;
  if found then
    if p_expected is null or cur <> p_expected then raise exception 'conflict'; end if;
    update public.wl_state set data = p_data, updated_at = ts where section = p_section;
  else
    insert into public.wl_state(section, data, updated_at) values (p_section, p_data, ts);
  end if;
  return ts;
end $$;

-- Alle Bereiche lesen (inkl. Abstimmung)
create or replace function public.wl_get(p_code text)
returns table(section text, data jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  perform public.wl_check(p_code);
  return query select s.section, s.data, s.updated_at from public.wl_state s;
end $$;

-- Einen Bereich schreiben
create or replace function public.wl_put(p_code text, p_section text, p_data jsonb, p_expected timestamptz default null)
returns timestamptz
language plpgsql security definer set search_path = public as $$
begin
  perform public.wl_check(p_code);
  if p_section not in ('anime','film','serie') then raise exception 'bad_section'; end if;
  return public.wl_save(p_section, p_data, p_expected);
end $$;

-- Swipe-Abstimmung lesen/schreiben
create or replace function public.wl_get_vote(p_code text)
returns table(section text, data jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  perform public.wl_check(p_code);
  return query select s.section, s.data, s.updated_at from public.wl_state s where s.section = 'vote';
end $$;

create or replace function public.wl_put_vote(p_code text, p_data jsonb, p_expected timestamptz default null)
returns timestamptz
language plpgsql security definer set search_path = public as $$
begin
  perform public.wl_check(p_code);
  return public.wl_save('vote', p_data, p_expected);
end $$;

-- Nur die vier Funktionen sind von außen aufrufbar
revoke all on function public.wl_check(text)                          from public, anon, authenticated;
revoke all on function public.wl_save(text, jsonb, timestamptz)       from public, anon, authenticated;
revoke all on function public.wl_get(text)                            from public;
revoke all on function public.wl_put(text, text, jsonb, timestamptz)  from public;
revoke all on function public.wl_get_vote(text)                       from public;
revoke all on function public.wl_put_vote(text, jsonb, timestamptz)   from public;
grant execute on function public.wl_get(text)                           to anon, authenticated;
grant execute on function public.wl_put(text, text, jsonb, timestamptz) to anon, authenticated;
grant execute on function public.wl_get_vote(text)                      to anon, authenticated;
grant execute on function public.wl_put_vote(text, jsonb, timestamptz)  to anon, authenticated;

-- ===== Haushalts-Code setzen (hier euren Code eintragen) =====
insert into public.wl_household(id, code_hash)
values (1, encode(extensions.digest('EUER-HAUSHALTS-CODE', 'sha256'), 'hex'))
on conflict (id) do update set code_hash = excluded.code_hash;

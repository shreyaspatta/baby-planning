-- Baby Planner — Supabase schema
-- Run this once in Supabase → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

create table if not exists public.entries (
  id         uuid primary key default gen_random_uuid(),
  board      text not null,                       -- 'inventory' | 'admin' | 'hospital'
  data       jsonb not null default '{}'::jsonb,  -- the row fields (item, status, ...)
  created_at timestamptz not null default now()
);

create index if not exists entries_board_created_idx
  on public.entries (board, created_at);

alter table public.entries enable row level security;

-- Private family app (shared PIN + unguessable URL): allow the anon key full access.
-- Tighten later with Supabase Auth if you store anything sensitive.
drop policy if exists "anon read"   on public.entries;
drop policy if exists "anon insert" on public.entries;
drop policy if exists "anon update" on public.entries;
drop policy if exists "anon delete" on public.entries;

create policy "anon read"   on public.entries for select using (true);
create policy "anon insert" on public.entries for insert with check (true);
create policy "anon update" on public.entries for update using (true) with check (true);
create policy "anon delete" on public.entries for delete using (true);

-- Live cross-device updates.
alter publication supabase_realtime add table public.entries;

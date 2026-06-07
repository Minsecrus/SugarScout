-- Run this in your Supabase SQL Editor.
-- This schema is designed for a public GitHub Pages app with no login.
-- It allows anonymous visitors to read, add, update, and delete beverages.

create table if not exists public.beverages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text not null,
  "sugarPer100ml" numeric not null,
  volume_ml integer not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop policy if exists "Public beverages are viewable by everyone." on public.beverages;
drop policy if exists "Users can insert their own beverages." on public.beverages;
drop policy if exists "Users can update their own beverages." on public.beverages;
drop policy if exists "Users can delete their own beverages." on public.beverages;
drop policy if exists "Anyone can view beverages." on public.beverages;
drop policy if exists "Anyone can insert beverages." on public.beverages;
drop policy if exists "Anyone can update beverages." on public.beverages;
drop policy if exists "Anyone can delete beverages." on public.beverages;

alter table public.beverages
  drop column if exists "uploaderId";

alter table public.beverages enable row level security;

create policy "Anyone can view beverages."
  on public.beverages for select
  using (true);

create policy "Anyone can insert beverages."
  on public.beverages for insert
  with check (true);

create policy "Anyone can update beverages."
  on public.beverages for update
  using (true)
  with check (true);

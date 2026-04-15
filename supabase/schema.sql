-- Délice Douja — run ONCE in the SAME Supabase project as your .env URL
--
-- 1) Dashboard → SQL → New query → paste this ENTIRE file → Run
-- 2) Table Editor → you should see `products` and `orders`
-- 3) If the API still says "schema cache": wait ~30s, or Dashboard → Settings → API
--    → ensure "Exposed schemas" includes `public`
--
-- Project: https://supabase.com/dashboard/project/kgyeyjxvtoumrjpzmdnt

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  description text not null,
  price double precision not null,
  image text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigserial primary key,
  name text not null,
  email text not null default '',
  phone text not null,
  address text not null,
  quantity int not null,
  category text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table if exists public.orders add column if not exists email text not null default '';

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- The service role key (server-only) bypasses RLS and is required for admin
-- product CRUD. The anon key can read products and insert orders as below.

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Drop policies if re-running (idempotent-ish)
drop policy if exists "products_select_public" on public.products;
drop policy if exists "orders_insert_public" on public.orders;

-- Anyone can read the catalog (storefront)
create policy "products_select_public"
  on public.products
  for select
  using (true);

-- Contact form: anyone can submit an order request
create policy "orders_insert_public"
  on public.orders
  for insert
  with check (true);

-- Optional: allow anon to mutate products ONLY for local demos without service role.
-- REMOVE in production or use Supabase Auth + restrictive policies instead.
-- Uncomment if you insist on using only the anon key for admin (not recommended):
-- drop policy if exists "products_write_anon_demo" on public.products;
-- create policy "products_write_anon_demo"
--   on public.products
--   for all
--   to anon
--   using (true)
--   with check (true);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Tell PostgREST to reload the schema cache (fixes "Could not find the table ... in the schema cache")
notify pgrst, 'reload schema';

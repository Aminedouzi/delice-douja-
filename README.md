# Délice Douja — Bakery storefront (Next.js + Supabase)

Next.js 14 (App Router), Tailwind CSS, and **Supabase** (Postgres) for products and order requests. Public site: **EN / FR / AR (RTL)**. Admin: password + JWT cookie (same as before).

## Supabase setup

### Option A — from your PC (automated)

1. In Supabase: **Project Settings → Database → Connection string → URI** (Session pooler is fine). Copy it and put your **database password** in the URL (not the anon JWT; use “Reset database password” if needed).
2. Add to **`.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres...."
   ```
3. Run:
   ```bash
   npm run db:setup
   ```
   This applies `supabase/schema.sql` and runs `npm run check:db`.

### Option B — in the dashboard (manual)

1. **SQL → New query** → paste all of `supabase/schema.sql` → **Run**.
2. **Table Editor** → confirm `products` and `orders`.

If the app says **“schema cache”**, wait ~30s or re-run the `NOTIFY pgrst` line at the end of `schema.sql`.

Optionally run `supabase/seed.sql` for sample products.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

If you prefer to keep local secrets in a machine-only file, also copy `.env.local.example` to `.env.local`. Next.js loads `.env.local` first, and it is ignored by Git:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — required so admin API can insert/update/delete products (RLS blocks anon writes). |
| `ADMIN_PASSWORD` / `ADMIN_JWT_SECRET` | Admin login |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (SEO / sitemap) |
| `FORMSPREE_ENDPOINT` / `ORDER_NOTIFICATION_EMAIL` | Contact / order notifications |

## Run locally

```bash
npm install
npm run doctor          # checks .env + that Supabase sees table `products`
npm run dev:clean       # clean .next, doctor, then Turbopack dev
```

Or only `npm run dev` after things already work.

`npm run dev` uses **Turbopack** (`--turbo`) to avoid Windows/Webpack issues such as `Cannot find module './948.js'`. If you must use Webpack, run `npm run dev:webpack` (after `npm run clean` if chunks break).

### Same problems over and over?

1. **`npm run doctor`** — prints what is wrong (missing keys, missing `products` table, path with spaces).
2. **Folder path** — avoid spaces. Example: copy the project to `C:\dev\delice-douja`, then `npm install` and use that folder in Cursor.
3. **Supabase** — `doctor` failing on `products` means you still need to run **`supabase/schema.sql`** in the SQL editor for the project that matches your URL in `.env.local`.
4. **Webpack chunk errors** — use `npm run dev` (Turbopack), or `npm run clean` then try again.
5. **`dev:clean` stops at doctor`** — fix Supabase/SQL first, or start without the check: `npm run dev:fresh`.

- Store: `http://localhost:3000` → `/fr/store`
- Admin: `http://localhost:3000/admin/login`

## Project layout

- `lib/supabaseClient.ts` — browser client (`anon` key)
- `lib/supabaseServer.ts` — server client (service role preferred)
- `services/products.ts` — `getAllProducts`, `getProductsByCategory`, `addProduct`, `updateProduct`, `deleteProduct`, `getProductById`
- `services/orders.ts` — `createOrder` (contact form)
- `supabase/schema.sql` — database DDL + RLS

## Deploy (Vercel)

Add the same env vars in Vercel. Never commit real `.env` or `.env.local` files, and never commit secrets such as `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_JWT_SECRET`.

## License

Private project for Délice Douja.

import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getAllProducts } from "@/services/products";
import type { ProductRow } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let products: ProductRow[] = [];
  let error = "";
  try {
    products = await getAllProducts();
  } catch (err) {
    products = [];
    error = err instanceof Error ? err.message : "Failed to load products.";
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const serviceRoleMissing = !serviceRoleKey || serviceRoleKey.length < 30;

  return (
    <div>
      {serviceRoleMissing ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-800">
          Admin writes are disabled because <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is not set or invalid in your environment. Add it to <code className="font-mono">.env.local</code> and restart <code className="font-mono">npm run dev</code>.
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-gold">
          Products
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-chocolate hover:bg-gold-dark"
          >
            <PlusIcon className="h-4 w-4" />
            Add product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {error ? (
        <p className="mt-12 rounded-xl bg-red-900/40 px-6 py-4 text-center text-sm text-red-100">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="mt-12 text-center text-cream/50">
          No products loaded. Check Supabase env vars, run{" "}
          <code className="text-gold">supabase/schema.sql</code>, and set{" "}
          <code className="text-gold">SUPABASE_SERVICE_ROLE_KEY</code> for admin
          writes.
        </p>
      ) : null}

      <ul className="mt-10 space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-cream/10 bg-cream/5 p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream/10">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-cream">{p.name}</p>
              <p className="text-xs text-cream/50">{p.category}</p>
              <p className="text-sm text-gold">{p.price} MAD</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-3 py-1.5 text-sm text-gold transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </Link>
              <DeleteProductButton id={p.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
    </svg>
  );
}

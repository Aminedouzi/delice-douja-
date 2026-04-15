import Link from "next/link";
import { ProductEditor } from "@/components/admin/ProductEditor";

export default function NewProductPage() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const serviceRoleMissing = !serviceRoleKey || serviceRoleKey.length < 30;

  return (
    <div>
      {serviceRoleMissing ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-800">
          Admin writes are disabled because <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is not set or invalid. Add it to <code className="font-mono">.env.local</code> and restart <code className="font-mono">npm run dev</code>.
        </div>
      ) : null}
      <Link
        href="/admin/dashboard"
        className="text-sm text-gold hover:underline"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-gold">
        New product
      </h1>
      <div className="mt-8">
        <ProductEditor />
      </div>
    </div>
  );
}

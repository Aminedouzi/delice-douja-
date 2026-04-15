import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | Délice Douja",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-chocolate text-cream">
      <div className="border-b border-cream/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="font-display text-lg font-semibold text-gold"
          >
            Délice Douja — Admin
          </Link>
          <Link
            href="/fr"
            className="text-sm text-cream/70 hover:text-gold"
          >
            View site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

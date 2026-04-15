import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/constants";

export default function NotFound() {
  const prefix = `/${DEFAULT_LOCALE}`;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-chocolate">404</h1>
      <p className="mt-2 text-chocolate/70">Page not found</p>
      <Link
        href={prefix}
        className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-chocolate"
      >
        Home
      </Link>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const home = `/${DEFAULT_LOCALE}`;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-chocolate">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-chocolate/70">
        Please try again. If the problem continues, contact us by phone or
        WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-chocolate transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href={home}
          className="rounded-full border-2 border-chocolate/20 px-6 py-3 text-sm font-semibold text-chocolate transition hover:border-chocolate/40"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

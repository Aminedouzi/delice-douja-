"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CART_STORAGE_KEY } from "@/lib/cart";

export function HeaderCartButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    function readCartCount() {
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
          setTotalQuantity(0);
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          setTotalQuantity(0);
          return;
        }
        const count = parsed.reduce((sum, item) => {
          const quantity =
            item && typeof item.quantity === "number" ? item.quantity : 0;
          return sum + quantity;
        }, 0);
        setTotalQuantity(count);
      } catch {
        setTotalQuantity(0);
      }
    }

    function syncCartCount(event: StorageEvent) {
      if (event.key && event.key !== CART_STORAGE_KEY) return;
      readCartCount();
    }

    readCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("focus", readCartCount);
    window.addEventListener("cart-updated", readCartCount);

    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("focus", readCartCount);
      window.removeEventListener("cart-updated", readCartCount);
    };
  }, []);

  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-chocolate shadow-sm transition-all duration-200 hover:bg-white"
    >
      <BasketIcon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-chocolate">
        {totalQuantity}
      </span>
    </Link>
  );
}

function BasketIcon({ className }: { className?: string }) {
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
      <path d="M5 9h14l-1.2 9.2A2 2 0 0 1 15.82 20H8.18a2 2 0 0 1-1.98-1.8L5 9Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

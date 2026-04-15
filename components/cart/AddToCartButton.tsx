"use client";

import { useState } from "react";
import { toCartItem } from "@/lib/cart";
import type { ProductPublic } from "@/lib/types/database";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({
  product,
  label,
  addedLabel,
}: {
  product: ProductPublic;
  label: string;
  addedLabel: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(toCartItem(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center justify-center rounded-full border border-chocolate/15 bg-cream px-4 py-2 text-xs font-semibold text-chocolate transition-colors hover:border-gold hover:bg-light-pink/30 sm:text-sm"
    >
      <BasketIcon className="mr-2 h-4 w-4" />
      {added ? addedLabel : label}
    </button>
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

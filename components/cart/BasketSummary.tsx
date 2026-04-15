"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import type { Messages } from "@/lib/i18n";
import { createT } from "@/lib/t";

export function BasketSummary({ messages }: { messages: Messages }) {
  const t = createT(messages);
  const { items, totalQuantity, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-chocolate/10 bg-white/70 p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/delice-douja.png"
            alt="Delice Douja logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-rose-100 bg-white object-cover"
          />
          <div>
            <p className="font-display text-2xl font-semibold text-chocolate">
              {t("cart.title")}
            </p>
            <p className="mt-1 text-sm text-chocolate/70">{t("cart.empty")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id="basket"
      className="rounded-[2rem] border border-chocolate/10 bg-white/75 p-6 shadow-[0_20px_60px_rgba(88,45,32,0.08)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/delice-douja.png"
            alt="Delice Douja logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-rose-100 bg-white object-cover"
          />
          <div>
            <p className="font-display text-2xl font-semibold text-chocolate">
              {t("cart.title")}
            </p>
            <p className="mt-1 text-sm text-chocolate/70">
              {totalQuantity} {t("cart.itemsCount")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
        >
          {t("cart.clear")}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-chocolate/10 bg-cream/60 p-4"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-chocolate">{item.name}</p>
              <p className="text-xs uppercase tracking-wide text-gold-dark">
                {t(`categories.${item.category}`)}
              </p>
              <p className="mt-1 text-sm text-chocolate/70">
                {item.price.toFixed(2)} {t("store.price")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-9 w-9 rounded-full border border-chocolate/15 bg-white text-lg text-chocolate"
              >
                −
              </button>
              <span className="min-w-8 text-center font-semibold text-chocolate">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-9 w-9 rounded-full border border-chocolate/15 bg-white text-lg text-chocolate"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              {t("cart.remove")}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-chocolate/10 pt-6">
        <p className="text-sm text-chocolate/70">{t("cart.reviewNotice")}</p>
        <p className="text-lg font-bold text-chocolate">
          {t("cart.total")}: {totalPrice.toFixed(2)} {t("store.price")}
        </p>
      </div>
    </section>
  );
}

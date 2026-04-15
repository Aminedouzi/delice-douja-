"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Messages } from "@/lib/i18n";
import { createT } from "@/lib/t";

export function BasketOrderForm({ messages }: { messages: Messages }) {
  const t = useMemo(() => createT(messages), [messages]);
  const { items, totalQuantity, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  if (items.length === 0) {
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorDetail(null);

    const basketMessage = [
      message.trim(),
      "",
      t("cart.orderSummary"),
      ...items.map(
        (item) =>
          `- ${item.name} x${item.quantity} (${item.price.toFixed(2)} ${t(
            "store.price"
          )})`
      ),
      "",
      "Product images:",
      ...items.map((item) => `- ${item.name}: ${item.image}`),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          quantity: totalQuantity,
          category: items.length === 1 ? items[0].category : "BASKET",
          message: basketMessage,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            category: item.category,
            price: item.price,
          })),
        }),
      });
      const dataJson = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof dataJson.error === "string"
            ? dataJson.error
            : "Request failed"
        );
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMessage("");
      clearCart();
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : null);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[2rem] border border-chocolate/10 bg-white/80 p-6 shadow-card sm:p-8"
    >
      <div>
        <h2 className="font-display text-2xl font-semibold text-chocolate">
          {t("cart.checkoutTitle")}
        </h2>
        <p className="mt-2 text-sm text-chocolate/70">
          {t("cart.checkoutSubtitle")}
        </p>
      </div>

      {status === "success" && (
        <p
          className="rounded-xl bg-light-pink/50 px-4 py-3 text-sm font-medium text-chocolate"
          role="status"
        >
          {t("contact.success")}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorDetail ?? t("contact.error")}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.name")}
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.email")}
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.phone")}
        </label>
        <input
          required
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.address")}
        </label>
        <textarea
          required
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-chocolate">
            {t("contact.quantity")}
          </label>
          <input
            required
            type="number"
            min={1}
            max={9999}
            value={totalQuantity}
            disabled
            className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none"
          />
          <p className="mt-2 text-xs text-chocolate/60">
            {t("cart.quantityAuto")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-chocolate">
            {t("contact.category")}
          </label>
          <input
            required
            value={
              items.length === 1
                ? t(`categories.${items[0].category}`)
                : t("cart.multiCategory")
            }
            disabled
            className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none"
          />
          <p className="mt-2 text-xs text-chocolate/60">
            {items.length === 1 ? t("cart.singleCategoryAuto") : t("cart.categoryAuto")}
          </p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.message")}
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-chocolate py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:bg-chocolate/90 disabled:opacity-60"
      >
        {status === "loading" ? t("contact.sending") : t("cart.submit")}
      </button>
    </form>
  );
}

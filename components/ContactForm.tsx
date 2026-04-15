"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ProductCategory } from "@/lib/constants";
import { CATEGORY_ORDER } from "@/lib/constants";
import type { Messages } from "@/lib/i18n";
import { createT } from "@/lib/t";

const categoryValues: ProductCategory[] = [...CATEGORY_ORDER];

export function ContactForm({ messages }: { messages: Messages }) {
  const t = useMemo(() => createT(messages), [messages]);
  const searchParams = useSearchParams();
  const initialCategory = useMemo(() => {
    const c = searchParams?.get("category");
    if (c && categoryValues.includes(c as ProductCategory)) return c;
    return "";
  }, [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    const c = searchParams?.get("category");
    if (c && categoryValues.includes(c as ProductCategory)) {
      setCategory(c);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorDetail(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          quantity,
          category,
          message,
          items: [],
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
      setQuantity(1);
      setCategory("");
      setMessage("");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : null);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-5 rounded-2xl border border-chocolate/10 bg-white/80 p-6 shadow-card sm:p-8"
    >
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
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.quantity")}
        </label>
        <input
          required
          type="number"
          min={1}
          max={9999}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-chocolate">
          {t("contact.category")}
        </label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-xl border border-chocolate/15 bg-cream/50 px-4 py-3 text-chocolate outline-none transition-shadow focus:ring-2 focus:ring-gold/50"
        >
          <option value="">{t("contact.selectCategory")}</option>
          {categoryValues.map((c) => (
            <option key={c} value={c}>
              {t(`categories.${c}`)}
            </option>
          ))}
        </select>
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
        {status === "loading" ? t("contact.sending") : t("contact.submit")}
      </button>
    </form>
  );
}

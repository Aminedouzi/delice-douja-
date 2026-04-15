"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductCategory } from "@/lib/constants";
import { CATEGORY_ORDER } from "@/lib/constants";
import type { ProductPublic } from "@/lib/types/database";

const categories = CATEGORY_ORDER as readonly ProductCategory[];

type Props = {
  product?: ProductPublic;
};

export function ProductEditor({ product }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    (product?.category as ProductCategory) ?? "COOKIES"
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function readErrorMessage(res: Response, fallback: string) {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      if (data && typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
      return fallback;
    }

    const text = await res.text().catch(() => "");
    if (text.trim()) return text;

    return `${fallback} (HTTP ${res.status})`;
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const priceNum = Number(price);

    if (!trimmedName) {
      setError("Please enter a product name.");
      return;
    }
    if (!trimmedDescription) {
      setError("Please enter a description.");
      return;
    }
    if (!trimmedImage) {
      setError("Please add an image URL or upload an image.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        name: trimmedName,
        description: trimmedDescription,
        price: priceNum,
        image: trimmedImage,
        category,
      };
      const url = isEdit
        ? `/api/products/${product!.id}`
        : "/api/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(await readErrorMessage(res, "Save failed"));
      }
      router.push(`/admin/dashboard?refresh=${Date.now()}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-cream/10 bg-cream/5 p-6 sm:p-8"
    >
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm text-cream/80">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-2.5 text-cream"
        />
      </div>

      <div>
        <label className="block text-sm text-cream/80">Description</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-2.5 text-cream"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-cream/80">Price (MAD)</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-2.5 text-cream"
          />
        </div>
        <div>
          <label className="block text-sm text-cream/80">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-2.5 text-cream"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-cream/80">Image URL</label>
        <input
          required
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-2.5 text-cream"
          placeholder="/uploads/... or https://..."
        />
        <p className="mt-2 text-xs text-cream/50">
          Or upload (max 4MB). On Vercel, use a public image URL or Supabase
          Storage.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onUpload}
          disabled={uploading}
          className="mt-2 block w-full text-sm text-cream/70 file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-chocolate"
        />
        {uploading && <p className="mt-1 text-xs text-gold">Uploading…</p>}
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-chocolate hover:bg-gold-dark disabled:opacity-50"
        >
          {isEdit ? (
            <EditIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-cream/30 px-6 py-3 text-sm text-cream"
        >
          Cancel
        </button>
      </div>
    </form>
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

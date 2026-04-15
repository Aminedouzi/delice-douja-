"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function readErrorMessage(res: Response) {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      if (data && typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
    }

    const text = await res.text().catch(() => "");
    return text.trim() || `Delete failed (HTTP ${res.status})`;
  }

  async function onDelete() {
    if (!confirm("Delete this product permanently?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }
      router.push(`/admin/dashboard?refresh=${Date.now()}`);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-3 py-1.5 text-sm text-red-300 transition hover:border-red-300/60 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
    >
      <TrashIcon className="h-4 w-4" />
      {loading ? "…" : "Delete"}
    </button>
  );
}

function TrashIcon({ className }: { className?: string }) {
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
      <path d="M3 6h18" />
      <path d="M8 6V4.75A1.75 1.75 0 0 1 9.75 3h4.5A1.75 1.75 0 0 1 16 4.75V6" />
      <path d="M19 6l-1 13.25A1.75 1.75 0 0 1 16.26 21H7.74A1.75 1.75 0 0 1 6 19.25L5 6" />
      <path d="M10 10.5v6" />
      <path d="M14 10.5v6" />
    </svg>
  );
}

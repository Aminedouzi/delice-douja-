"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") ?? "/admin/dashboard";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        setLoading(false);
        return;
      }
      router.push(from.startsWith("/admin") ? from : "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Request failed");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-cream/10 bg-cream/5 p-8">
      <h1 className="font-display text-2xl font-semibold text-gold">
        Admin login
      </h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        <div>
          <label className="block text-sm text-cream/80">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-cream/20 bg-chocolate px-4 py-3 text-cream outline-none focus:ring-2 focus:ring-gold/50"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-chocolate hover:bg-gold-dark disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-cream/10" />}>
      <LoginForm />
    </Suspense>
  );
}

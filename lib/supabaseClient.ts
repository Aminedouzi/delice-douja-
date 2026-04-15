import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser / public client using the anon key.
 * Safe to import from client components when only using RLS-allowed operations.
 */
export function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env " +
        "(Supabase → Project Settings → API). Restart npm run dev after saving."
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  });
}

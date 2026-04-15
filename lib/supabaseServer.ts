import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client for API routes, Server Components, and server actions.
 * Uses the service role key when set (bypasses RLS — required for admin CRUD in production).
 * Falls back to the anon key if the service role is not set (works only if RLS policies allow writes).
 */
const SUPABASE_SETUP_URL =
  "https://supabase.com/dashboard/project/kgyeyjxvtoumrjpzmdnt/settings/api";

export function createServerSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      `Supabase env is not set. In the project folder, edit .env and set:\n` +
        `  NEXT_PUBLIC_SUPABASE_URL\n` +
        `  NEXT_PUBLIC_SUPABASE_ANON_KEY  (and optionally SUPABASE_SERVICE_ROLE_KEY for admin CRUD)\n` +
        `Copy keys from: ${SUPABASE_SETUP_URL}\n` +
        `Then stop and restart npm run dev (required for NEXT_PUBLIC_* variables).`
    );
  }

  const key = serviceKey && serviceKey.length > 0 ? serviceKey : anonKey;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

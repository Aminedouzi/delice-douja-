import { NextResponse } from "next/server";

const MESSAGE =
  "Missing SUPABASE_SERVICE_ROLE_KEY. Creating or editing products requires the service role key (it bypasses RLS). In Supabase: Project Settings → API → copy service_role (Reveal). Put it in .env.local as SUPABASE_SERVICE_ROLE_KEY=... then restart npm run dev. Never expose this key in the browser or commit it.";

/**
 * Product writes use RLS; only the service role can insert/update/delete with our schema.
 * Returns a JSON error response if the key is absent, otherwise null.
 */
export function serviceRoleMissingResponse(): NextResponse | null {
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!sk || sk.length < 30) {
    return NextResponse.json({ error: MESSAGE }, { status: 503 });
  }
  return null;
}

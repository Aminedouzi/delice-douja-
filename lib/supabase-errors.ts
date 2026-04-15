import type { PostgrestError } from "@supabase/supabase-js";

const RLS_HINT =
  "Database blocked this (row security). Add SUPABASE_SERVICE_ROLE_KEY to .env.local from Supabase → API → service_role, then restart npm run dev.";

export function toUserMessage(error: PostgrestError): string {
  const raw = (error.message || "").toLowerCase();
  if (
    raw.includes("row-level security") ||
    raw.includes("violates row-level security") ||
    raw.includes("permission denied")
  ) {
    return RLS_HINT;
  }

  switch (error.code) {
    case "PGRST116":
      return "Product not found or not editable.";
    case "23505":
      return "This record already exists.";
    case "23503":
      return "Related data is missing or invalid.";
    case "42501":
      return RLS_HINT;
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

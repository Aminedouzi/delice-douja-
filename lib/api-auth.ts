import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function requireAdmin(
  request: NextRequest
): Promise<{ ok: true } | { ok: false; status: number; body: object }> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return { ok: false, status: 401, body: { error: "Unauthorized" } };
  }
  return { ok: true };
}

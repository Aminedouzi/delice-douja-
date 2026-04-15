import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_JWT_SECRET must be set in production");
    }
    return "dev-only-insecure-secret-min-16";
  }
  return s;
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(getSecret()));
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(getSecret())
    );
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export { COOKIE as ADMIN_SESSION_COOKIE };

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    if (process.env.NODE_ENV === "production") return false;
    return password === "admin";
  }
  return password === expected;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/constants";

function jwtSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (s && s.length >= 16) return s;
  return "dev-only-insecure-secret-min-16";
}

async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret())
    );
    return payload.role === "admin";
  } catch {
    return false;
  }
}

function pathnameHasLocale(pathname: string): boolean {
  return LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }
    const ok = await isAdminAuthenticated(request);
    if (!ok) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.includes(".") &&
    !pathname.startsWith("/.well-known")
  ) {
    return NextResponse.next();
  }

  if (!pathnameHasLocale(pathname)) {
    const locale = DEFAULT_LOCALE;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const first = pathname.split("/")[1] as string;
  const locale = (LOCALES.includes(first as Locale) ? first : DEFAULT_LOCALE) as Locale;
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: [
    /*
     * Skip Next internals, API routes, and common static files so middleware cannot interfere
     * with dev tooling or favicon requests.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

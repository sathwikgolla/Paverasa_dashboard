import { NextResponse } from "next/server";
import { canAccessRoute } from "./app/lib/roles";
import { SESSION_COOKIE, verifySessionToken } from "./app/lib/session";

const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);
const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
];

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.has(pathname)) return true;

  return PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));
}

function isAuthPage(pathname) {
  return pathname === "/" || pathname === "/login" || pathname === "/register";
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (isPublicPath(pathname)) {
    if (session && isAuthPage(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessRoute(session.role, pathname)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
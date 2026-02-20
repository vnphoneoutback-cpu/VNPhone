import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register"];
const ADMIN_PATHS = ["/admin", "/api/staff"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check JWT
  const token = request.cookies.get("vnphone-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Admin-only routes
    if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Attach staff info to headers for API routes
    const response = NextResponse.next();
    response.headers.set("x-staff-id", String(payload.sub));
    response.headers.set("x-staff-role", String(payload.role));
    response.headers.set("x-staff-company", String(payload.company));
    return response;
  } catch {
    // Invalid token — redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("vnphone-token");
    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/sheets/:path*",
    "/api/staff/:path*",
    "/api/logs/:path*",
  ],
};

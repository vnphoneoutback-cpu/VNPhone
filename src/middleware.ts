import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET env var");
}

const JWT_SECRET = new TextEncoder().encode(jwtSecret);

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register"];
const ADMIN_PATHS = ["/admin", "/api/staff"];

function isApiRoute(pathname: string) {
  return pathname.startsWith("/api/");
}

function rejectUnauthorized(request: NextRequest, pathname: string) {
  if (isApiRoute(pathname)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

function rejectForbidden(request: NextRequest, pathname: string) {
  if (isApiRoute(pathname)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check JWT
  const token = request.cookies.get("vnphone-token")?.value;
  if (!token) {
    return rejectUnauthorized(request, pathname);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const staffId = typeof payload.sub === "string" ? payload.sub : "";
    const staffRole = typeof payload.role === "string" ? payload.role : "";
    const staffCompany = typeof payload.company === "string" ? payload.company : "";

    if (!staffId || !staffRole || !staffCompany) {
      return rejectUnauthorized(request, pathname);
    }

    // Admin-only routes
    if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      if (staffRole !== "admin") {
        return rejectForbidden(request, pathname);
      }
    }

    // Attach verified staff info to request headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-staff-id", staffId);
    requestHeaders.set("x-staff-role", staffRole);
    requestHeaders.set("x-staff-company", staffCompany);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Invalid token — clear cookie and reject
    const response = rejectUnauthorized(request, pathname);
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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configura para que este middleware solo se ejecute en rutas /admin
export const config = {
  matcher: "/admin/:path*",
};

export function middleware(request: NextRequest) {
  /**
   * Add a new header x-current-path which passes the path to downstream components
   * This is useful to check the current path in server components
   * For example, in the admin layout we can check the current path and avoid infinite redirects
   */
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth/session";

const protectedRoutes = ["/admin/dashboard"];
const publicRoutes = ["/admin", "/admin/login", "/admin/create-initial-user"];

// Configure this middleware to run only on /admin routes
export const config = {
  matcher: "/admin/:path*",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const session = await getSession();

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  // If the route is public and the user is authenticated, redirect to dashboard
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  /**
   * Add a new header x-current-path which passes the path to downstream components
   * Add a new header x-user-id which passes the user id to downstream components
   *
   * This is use for the AdminLayout component to determine which page to redirect to
   * based on the user session and the number of users in the database.
   * This is a workaround for the fact that prisma client is not available in middleware.
   * Prisma client needs to be run in a Node.js environment, and middleware runs in Edge Runtime.
   */
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);
  if (session) {
    requestHeaders.set("x-user-id", session);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth/session";
import { ROUTES } from "./lib/constants/dashboard";

function isProtected(pathname: string): boolean {
  return pathname.startsWith(ROUTES.dashboard);
}

function isPublic(pathname: string): boolean {
  return [ROUTES.admin, ROUTES.login, ROUTES.createInitalUser].includes(
    pathname
  );
}

function isAdminOnly(pathname: string): boolean {
  return pathname.startsWith(ROUTES.users);
}

// Configure this middleware to run only on /admin routes
export const config = {
  matcher: "/admin/:path*",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await getSession();

  // Protected routes + no session -> redirect to login
  if (isProtected(pathname) && !session) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }
  // Public routes + session -> redirect to dashboard
  if (isPublic(pathname) && session) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  // Admin only routes + no ADMIN user -> redirect to dashboard
  if (isAdminOnly(pathname) && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
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
    requestHeaders.set("x-user-id", session.userId);
  } else {
    requestHeaders.delete("x-user-id");
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

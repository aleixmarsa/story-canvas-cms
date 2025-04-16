import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { ROUTES } from "@/lib/constants/dashboard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCount = await prisma.user.count();
  const headerList = await headers();

  const pathname = headerList.get("x-current-path");
  const userId = headerList.get("x-user-id");

  const isLoggedIn = Boolean(userId);
  const isDashboard = pathname === ROUTES.dashboard;
  const isInitialUserPage = pathname === ROUTES.createInitalUser;
  const isLoginPage = pathname === ROUTES.login;

  // Redirect to dashboard if user is logged in and not on dashboard
  if (isLoggedIn && !isDashboard) {
    redirect(ROUTES.dashboard);
  }

  // Redirect to create initial user page if no users exist and not on initial user page
  if (!isLoggedIn && userCount === 0 && !isInitialUserPage) {
    redirect(ROUTES.createInitalUser);
  }

  // Redirect to login page if a user exists and not on login page
  if (!isLoggedIn && userCount > 0 && !isLoginPage) {
    redirect(ROUTES.login);
  }

  return <>{children}</>;
}

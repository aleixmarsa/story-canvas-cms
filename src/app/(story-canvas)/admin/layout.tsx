import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Toaster } from "@/components/ui/sonner";
import { checkDbConnection } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();

  const pathname = headerList.get("x-current-path");
  const userId = headerList.get("x-user-id");

  const isLoggedIn = Boolean(userId);
  const isInitialUserPage = pathname === ROUTES.createInitalUser;
  const isLoginPage = pathname === ROUTES.login;
  const isErrorPage = pathname === ROUTES.error;
  const isAdminPage = pathname === ROUTES.admin;

  if (isAdminPage) {
    redirect(ROUTES.login);
  }
  // Check if the database connection is successful
  const isDbUp = await checkDbConnection();
  if (!isDbUp && !isErrorPage) {
    redirect(`${ROUTES.error}?type=db`);
  }

  // Redirect to dashboard if user is logged in and on initial user page or login page
  if (isLoggedIn && (isInitialUserPage || isLoginPage)) {
    redirect(ROUTES.dashboard);
  }

  return (
    <>
      {children}
      <Toaster richColors duration={2500} />
    </>
  );
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Toaster } from "@/components/ui/sonner";
import { countAllUsers } from "@/lib/dal/users";
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

  // Check if the database connection is successful
  const isDbUp = await checkDbConnection();
  if (!isDbUp && !isErrorPage) {
    redirect(`${ROUTES.error}?type=db`);
  }

  // Fetch the number of users
  const countResult = await countAllUsers();
  if ("error" in countResult && !isErrorPage) {
    redirect(`${ROUTES.error}?type=count`);
  }

  // Redirect to dashboard if user is logged in and on initial user page or login page
  if (isLoggedIn && (isInitialUserPage || isLoginPage)) {
    redirect(ROUTES.dashboard);
  }

  // Redirect to create initial user page if no users exist and not on initial user page
  if (
    !isLoggedIn &&
    "numberOfUsers" in countResult &&
    countResult.numberOfUsers === 0 &&
    !isInitialUserPage
  ) {
    redirect(ROUTES.createInitalUser);
  }

  // Redirect to login page if a user exists and not on login page
  if (
    !isLoggedIn &&
    "numberOfUsers" in countResult &&
    countResult.numberOfUsers > 0 &&
    !isLoginPage
  ) {
    redirect(ROUTES.login);
  }

  return (
    <>
      {children}
      <Toaster richColors duration={2500} />
    </>
  );
}

import { getCurrentUser } from "@/lib/dal/auth";
import { getAllUsers } from "@/lib/dal/users";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import UsersTableWrapper from "@/components/storyCanvas/dashboard/user/UsersTableWrapper";
import { Role } from "@prisma/client";

const UsersPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.login);
  }

  const isAdmin = currentUser.role === Role.ADMIN;

  const users = await getAllUsers();

  return (
    <>
      {isAdmin && (
        <DashboardHeader
          title="Users"
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
          addHref={ROUTES.newUser}
          addButtonLabel="New User"
        />
      )}
      {!isAdmin && (
        <DashboardHeader
          title="Users"
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        />
      )}
      <UsersTableWrapper currentUser={currentUser} users={users} />
    </>
  );
};

export default UsersPage;

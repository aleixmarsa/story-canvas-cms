import { getCurrentUser } from "@/lib/dal/auth";
import { getAllUsers } from "@/lib/dal/user";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { ROUTES } from "@/lib/constants/storyCanvas";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/UserDataTableColumns";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";

const UsersPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  if (user.role !== Role.ADMIN) {
    redirect(ROUTES.dashboard);
  }

  const users = await getAllUsers();

  return (
    <>
      <DashboardHeader
        title="Users"
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        addHref={`${ROUTES.users}/new`}
        addButtonLabel="New User"
      />
      <div className="px-6">
        <DataTable columns={columns} data={users} />
      </div>
    </>
  );
};

export default UsersPage;

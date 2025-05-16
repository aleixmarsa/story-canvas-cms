"use client";

import { useEffect } from "react";
import { deleteUser } from "@/lib/actions/users/delete-user";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/UserDataTableColumns";
import DataTable from "../DataTable/DataTable";
import { CurrentUser } from "@/types/auth";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Role } from "@prisma/client";

const UsersTableWrapper = ({
  users,
  currentUser,
}: {
  users: CurrentUser[];
  currentUser: CurrentUser;
}) => {
  const {
    users: zustandUsers,
    setUsers,
    deleteUser: deleteUserFromStore,
    addUser,
  } = useDashboardStore();

  const isAdmin = currentUser.role === Role.ADMIN;

  useEffect(() => {
    setUsers(users);
  }, [users, setUsers]);

  const handleDelete = async (user: CurrentUser) => {
    //Delete user from the store
    deleteUserFromStore(user.id);

    toast.success("User has been removed", {
      description: `${user.email} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Add the user back to the store
          addUser(user);
          toast.dismiss();
          toast.success("User has been restored", {
            description: `${user.email} has been restored.`,
          });
        },
      },
      onAutoClose: async () => {
        // Delete user from the database when the toast is closed
        const res = await deleteUser(user.id);
        if (!res.success) {
          toast.error("Failed to delete user");
          addUser(user);
        }
      },
    });
  };

  return (
    <div className="px-4 md:px-6">
      {isAdmin ? (
        <DataTable
          columns={columns(currentUser, handleDelete)}
          data={zustandUsers}
          addHref={ROUTES.newUser}
          addButtonLabel="New User"
        />
      ) : (
        <DataTable
          columns={columns(currentUser, handleDelete)}
          data={zustandUsers}
        />
      )}
    </div>
  );
};

export default UsersTableWrapper;

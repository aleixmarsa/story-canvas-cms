"use client";

import { useEffect } from "react";
import { deleteUser } from "@/lib/actions/users/delete-user";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/UserDataTableColumns";
import DataTable from "../DataTable/DataTable";
import { CurrentUser } from "@/types/auth";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toast } from "sonner";

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
    <div className="px-6">
      <DataTable
        columns={columns(currentUser, handleDelete)}
        data={zustandUsers}
        filterConfig={{
          columnKey: "email",
          placeholder: "Search by Email...",
        }}
      />
    </div>
  );
};

export default UsersTableWrapper;

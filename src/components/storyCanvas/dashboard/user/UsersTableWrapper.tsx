"use client";

import { deleteUser } from "@/lib/actions/users/delete-user";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/UserDataTableColumns";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { CurrentUser } from "@/types/auth";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useEffect } from "react";

export function UsersTableWrapper({ users }: { users: CurrentUser[] }) {
  const zustandUsers = useDashboardStore((s) => s.users);
  const setUsers = useDashboardStore((s) => s.setUsers);
  const deleteUserFromStore = useDashboardStore((s) => s.deleteUser);

  useEffect(() => {
    setUsers(users);
  }, [users, setUsers]);

  const handleDelete = async (user: CurrentUser) => {
    const res = await deleteUser(user.id);

    if (res.success) {
      deleteUserFromStore(user.id);
    } else {
      console.error("Error deleting user:", res.error);
    }
  };

  return (
    <div className="px-6">
      <DataTable
        columns={columns}
        data={zustandUsers}
        renderDeleteButton={(user) => (
          <DeleteUserDialog
            userEmail={user.email}
            onConfirm={() => handleDelete(user)}
          />
        )}
      />
    </div>
  );
}

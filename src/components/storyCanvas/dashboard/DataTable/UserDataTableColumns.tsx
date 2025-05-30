"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserForTable } from "@/types/user";
import { Button } from "@/components/ui/button";
import RowActionsMenu from "./RowActionsMenu";
import { ArrowUpDown } from "lucide-react";
import DeleteDialog from "../DeleteDialog";
import { Role } from "@prisma/client";
import { CurrentUser } from "@/types/auth";

export const columns = (
  currentUser: CurrentUser,
  handleDelete: (user: UserForTable) => Promise<void>
): ColumnDef<UserForTable>[] => [
  {
    id: "email",

    enableHiding: false,
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      if (user.id === currentUser.id || currentUser.role !== Role.ADMIN)
        return <></>;
      return (
        <RowActionsMenu
          item={user}
          renderDeleteButton={(user) => {
            return (
              <DeleteDialog
                onConfirm={() => handleDelete(user)}
                dialogTitle="Delete user"
                itemName={user.email}
              />
            );
          }}
        />
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Story = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  createdAt: string;
};

export const columns: ColumnDef<Story>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Story["status"];
      return (
        <Badge variant={status === "published" ? "default" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
];

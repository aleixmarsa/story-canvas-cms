"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SectionWithVersions } from "@/types/section";

export const columns: ColumnDef<SectionWithVersions>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.currentDraft?.name ?? "(untitled)",
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.currentDraft?.type ?? "(untitled)",
  },
  {
    accessorKey: "order",
    accessorFn: (row) => row.currentDraft?.order ?? "(untitled)",
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

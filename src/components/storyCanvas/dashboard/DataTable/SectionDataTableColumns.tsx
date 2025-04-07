"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SectionWithVersions } from "@/types/section";
import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";

export const columns: ColumnDef<SectionWithVersions>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.currentDraft?.name ?? "(untitled)",
  },
  {
    header: "Status",
    accessorFn: (row) =>
      row.publishedVersion ? StoryStatus.published : StoryStatus.draft,
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      return (
        <Badge
          variant={status === StoryStatus.published ? "default" : "outline"}
        >
          {status}
        </Badge>
      );
    },
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

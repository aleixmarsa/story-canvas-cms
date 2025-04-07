"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StoryWithVersions } from "@/types/story";
import { StoryStatus } from "@prisma/client";

export const columns: ColumnDef<StoryWithVersions>[] = [
  {
    header: "Title",
    accessorFn: (row) => row.currentDraft?.title ?? "(untitled)",
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
    header: "Author",
    accessorFn: (row) => row.currentDraft?.createdBy ?? "-",
  },
  {
    header: "Slug",
    accessorFn: (row) => row.currentDraft?.slug ?? "-",
  },
  {
    header: "Date",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      const date = new Date(row.getValue("Date"));
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
];

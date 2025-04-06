"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StoryWithVersions } from "@/types/story";

export const columns: ColumnDef<StoryWithVersions>[] = [
  {
    header: "Title",
    accessorFn: (row) => row.currentDraft?.title ?? "(untitled)",
  },
  {
    header: "Status",
    accessorFn: (row) => (row.publishedVersion ? "published" : "draft"),
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      return (
        <Badge variant={status === "published" ? "default" : "outline"}>
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

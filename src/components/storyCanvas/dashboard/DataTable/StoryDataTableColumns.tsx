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
    accessorFn: (row) => {
      if (!row.publishedAt) return StoryStatus.draft;
      if (!row.currentDraft) return StoryStatus.published;
      const publishedAt = new Date(row.publishedAt);
      const draftUpdatedAt = new Date(row.currentDraft.updatedAt);
      publishedAt.setMilliseconds(0);
      draftUpdatedAt.setMilliseconds(0);
      return publishedAt >= draftUpdatedAt
        ? StoryStatus.published
        : StoryStatus.changed;
    },
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      return (
        <Badge
          variant={
            status === StoryStatus.published
              ? "default"
              : status === StoryStatus.draft
              ? "outline"
              : "secondary"
          }
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

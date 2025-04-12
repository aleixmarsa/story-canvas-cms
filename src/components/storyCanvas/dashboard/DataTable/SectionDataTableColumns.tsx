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
    header: "Slug",
    accessorFn: (row) => row.currentDraft?.slug ?? "-",
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

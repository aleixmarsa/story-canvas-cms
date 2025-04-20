"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SectionWithVersions } from "@/types/section";
import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import RowActionsMenu from "./RowActionsMenu";
import { ROUTES } from "@/lib/constants/storyCanvas";

export const columns = (
  storySlug: string
): ColumnDef<SectionWithVersions>[] => [
  {
    id: "name",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    accessorFn: (row) => row.currentDraft?.name ?? "(untitled)",
  },
  {
    header: "Status",
    enableHiding: false,
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const section = row.original;
      return (
        <RowActionsMenu
          item={section}
          editHref={`${ROUTES.stories}/${storySlug}/${section.currentDraft?.slug}`}
          onDelete={() => console.log("Delete story", section.id)}
        />
      );
    },
  },
];

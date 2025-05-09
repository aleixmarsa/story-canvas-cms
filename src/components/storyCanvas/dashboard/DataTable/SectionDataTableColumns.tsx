"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SectionDraftMetadata } from "@/lib/dal/draft";
import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";
import { GripVertical } from "lucide-react";
import RowActionsMenu from "./RowActionsMenu";
import { ROUTES } from "@/lib/constants/story-canvas";
import DeleteDialog from "../DeleteDialog";

export const columns = (
  storySlug: string,
  handleDelete: (story: SectionDraftMetadata) => Promise<void>,
  handlePublish: (currentDraftId: number | undefined) => Promise<void>
): ColumnDef<SectionDraftMetadata>[] => [
  {
    id: "dragHandle",
    header: () => null,
    cell: () => <GripVertical />,
    enableHiding: false,
  },
  {
    id: "name",
    enableHiding: false,
    header: "Name",
    accessorFn: (row) => row.currentDraft.name ?? "(untitled)",
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
    accessorFn: (row) => row.currentDraft.slug ?? "-",
  },
  {
    header: "Type",
    accessorKey: "type",
    accessorFn: (row) => row.currentDraft?.type ?? "-",
  },
  {
    accessorKey: "order",
    header: "Order",
    accessorFn: (row) => row.currentDraft?.order ?? "-",
  },
  {
    header: "Updated At",
    accessorFn: (row) => row.currentDraft?.updatedAt ?? "-",
    cell: ({ row }) => {
      const date = new Date(row.getValue("Updated At") as string);
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
          onPublish={() => handlePublish(section.currentDraft?.id)}
          renderDeleteButton={(section) => {
            return (
              <div onClick={(e) => e.stopPropagation()}>
                <DeleteDialog
                  onConfirm={() => handleDelete(section)}
                  dialogTitle="Delete section"
                  itemName={section.currentDraft?.name ?? "(untitled)"}
                />
              </div>
            );
          }}
        />
      );
    },
  },
];

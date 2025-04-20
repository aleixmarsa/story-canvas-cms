"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StoryWithVersions } from "@/types/story";
import { StoryStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ROUTES } from "@/lib/constants/storyCanvas";
import RowActionsMenu from "./RowActionsMenu";
import DeleteDialog from "../DeleteDialog";
import { CurrentUser } from "@/types/auth";
import { Role } from "@prisma/client";

export const columns = (
  currentUser: CurrentUser,
  handleDelete: (story: StoryWithVersions) => Promise<void>
): ColumnDef<StoryWithVersions>[] => [
  {
    id: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    accessorFn: (row) => row.currentDraft?.title ?? "(untitled)",
    enableHiding: false,
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
    enableHiding: false,
  },
  {
    header: "Slug",
    accessorFn: (row) => row.currentDraft?.slug ?? "-",
    enableHiding: false,
  },
  {
    header: "Author",
    accessorFn: (row) => row.currentDraft?.createdBy ?? "-",
  },

  {
    header: "Updated At",
    accessorFn: (row) => row.updatedAt,
    cell: ({ row }) => {
      const date = new Date(row.getValue("Updated At"));
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
      const story = row.original;
      return (
        <RowActionsMenu
          item={story}
          editHref={`${ROUTES.stories}/${story.currentDraft?.slug}/edit`}
          renderDeleteButton={(story) => {
            if (currentUser.role !== Role.ADMIN) return null;
            return (
              <div onClick={(e) => e.stopPropagation()}>
                <DeleteDialog
                  onConfirm={() => handleDelete(story)}
                  dialogTitle="Delete story"
                  itemName={story.currentDraft?.title ?? "(untitled)"}
                />
              </div>
            );
          }}
        />
      );
    },
  },
];

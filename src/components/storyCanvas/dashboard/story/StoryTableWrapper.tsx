"use client";

import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DataTable from "../DataTable/DataTable";
import { CurrentUser } from "@/types/auth";
import { toast } from "sonner";
import { StoryDraftMetadata } from "@/lib/dal/draft";
import { deleteStory } from "@/lib/actions/stories/delete-story";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { Role } from "@prisma/client";
import { useStories, Response } from "@/lib/swr/useStories";

const StoryTableWrapper = ({ currentUser }: { currentUser: CurrentUser }) => {
  const { stories, mutate, isLoading, isError } = useStories();

  const isAdmin = currentUser.role === Role.ADMIN;

  const handleDelete = async (story: StoryDraftMetadata) => {
    // Optimistically remove from UI
    mutate(
      (prev: Response | undefined) => {
        if (!prev || !("success" in prev) || !prev.stories) return prev;

        return {
          ...prev,
          stories: prev.stories.filter((s) => s.id !== story.id),
        };
      },
      { revalidate: false }
    );

    toast.success("Story has been removed", {
      description: `${story.currentDraft?.title} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Optimistically add back on Undo click
          mutate(
            (prev): Response => {
              if (prev && "success" in prev) {
                return {
                  success: true,
                  stories: [...(prev.stories ?? []), story],
                };
              }

              return {
                success: true,
                stories: [story],
              };
            },
            { revalidate: false }
          );
        },
      },
      onAutoClose: async () => {
        // Remove from DB
        const res = await deleteStory(story.id);
        if (!res.success) {
          toast.error("Failed to delete story");
          // Add back in case of error
          mutate(
            (prev): Response => {
              if (prev && "success" in prev && Array.isArray(prev.stories)) {
                return {
                  success: true,
                  stories: [...prev.stories, story],
                };
              }
              // Fallback
              return {
                success: true,
                stories: [story],
              };
            },
            { revalidate: false }
          );
        } else {
          // Ensure backend is in sync
          mutate();
        }
      },
    });
  };

  return (
    <div className="px-6">
      {isAdmin ? (
        <DataTable
          columns={columns(currentUser, handleDelete)}
          data={stories}
          getRowLink={(row) => `${ROUTES.stories}/${row.currentDraft?.slug}`}
          filterConfig={{
            columnKey: "title",
            placeholder: "Search by Title...",
          }}
          addHref={ROUTES.newStory}
          addButtonLabel="New Story"
          dataIsLoading={isLoading}
          dataFetchingError={isError}
        />
      ) : (
        <DataTable
          columns={columns(currentUser, handleDelete)}
          data={stories}
          getRowLink={(row) => `${ROUTES.stories}/${row.currentDraft?.slug}`}
          filterConfig={{
            columnKey: "title",
            placeholder: "Search by Title...",
          }}
          dataIsLoading={isLoading}
          dataFetchingError={isError}
        />
      )}
    </div>
  );
};

export default StoryTableWrapper;

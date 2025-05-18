"use client";

import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DataTable from "../DataTable/DataTable";
import { CurrentUser } from "@/types/auth";
import { toast } from "sonner";
import { StoryDraftMetadata } from "@/lib/dal/draft";
import { softDeleteStory } from "@/lib/actions/stories/delete-story";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Role } from "@prisma/client";
import { useStories, Response } from "@/lib/swr/useStories";
import { createTemplateStory } from "@/lib/actions/stories/create-template-story";
import { useState } from "react";
import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const StoryTableWrapper = ({ currentUser }: { currentUser: CurrentUser }) => {
  const { stories, mutate, isLoading, isError } = useStories();
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const isAdmin = currentUser.role === Role.ADMIN;

  const handleDelete = async (story: StoryDraftMetadata) => {
    // Optimistically remove from UI
    mutate(
      (prev: Response | undefined) => {
        if (!prev) return prev;

        return stories.filter((s) => s.id !== story.id);
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
              if (prev && Array.isArray(prev)) {
                return [...(prev ?? []), story];
              }

              return [story];
            },
            { revalidate: false }
          );
        },
      },
      onAutoClose: async () => {
        // Remove from DB
        const res = await softDeleteStory(story.id);
        if (!res.success) {
          toast.error("Failed to delete story");
          // Add back in case of error
          mutate(
            (prev): Response => {
              if (prev && Array.isArray(prev)) {
                return [...prev, story];
              }
              // Fallback
              return [story];
            },
            { revalidate: false }
          );
        }
      },
    });
  };

  const handleCreateTemplate = async () => {
    setIsCreatingTemplate(true);
    try {
      const formData = new FormData();
      formData.set("createdBy", currentUser.email);
      await createTemplateStory(formData);
      mutate();
      toast.success("Template story created");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create template story");
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  return (
    <div className="px-4 md:px-6">
      {isAdmin ? (
        <DataTable
          columns={columns(currentUser, handleDelete)}
          data={stories}
          getRowLink={(row) => `${ROUTES.stories}/${row.currentDraft?.slug}`}
          addHref={ROUTES.newStory}
          addButtonLabel="New Story"
          dataIsLoading={isLoading}
          dataFetchingError={isError}
          customHeaderMessage={
            <Button
              variant="outline"
              size="sm"
              className="h-[36px]"
              onClick={handleCreateTemplate}
            >
              {isCreatingTemplate ? (
                <Loader2 className="animate-spin" />
              ) : (
                <WandSparkles className="w-4 h-4 mr-1" />
              )}
              <span>
                <span className="hidden md:inline">From </span>Template
              </span>
            </Button>
          }
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

"use client";

import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DataTable from "../DataTable/DataTable";
import { CurrentUser } from "@/types/auth";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toast } from "sonner";
import { StoryWithVersions } from "@/types/story";
import { deleteStory } from "@/lib/actions/stories/delete-story";
import { ROUTES } from "@/lib/constants/storyCanvas";

const StoryTableWrapper = ({ currentUser }: { currentUser: CurrentUser }) => {
  const {
    stories,
    deleteStory: deleteStoryFromStore,
    addStory,
  } = useDashboardStore();

  const handleDelete = async (story: StoryWithVersions) => {
    //Delete story from the store
    deleteStoryFromStore(story.id);

    toast.success("Story has been removed", {
      description: `${story.currentDraft?.title} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Add the story back to the store
          addStory(story);
          toast.dismiss();
          toast.success("Story has been restored", {
            description: `${story.currentDraft?.title} has been restored.`,
          });
        },
      },
      onAutoClose: async () => {
        // Delete user from the database when the toast is closed
        const res = await deleteStory(story.id);
        if (!res.success) {
          toast.error("Failed to delete user");
          addStory(story);
        }
      },
    });
  };

  return (
    <div className="px-6">
      <DataTable
        columns={columns(currentUser, handleDelete)}
        data={stories}
        getRowLink={(row) => `${ROUTES.stories}/${row.currentDraft?.slug}`}
        filterConfig={{
          columnKey: "title",
          placeholder: "Search by Title...",
        }}
      />
    </div>
  );
};

export default StoryTableWrapper;

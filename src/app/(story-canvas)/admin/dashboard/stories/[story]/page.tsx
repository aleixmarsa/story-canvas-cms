"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/SectionDataTableColumns";
import { SectionWithVersions } from "@/types/section";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { deleteSection } from "@/lib/actions/sections/delete-section";

const StoryPage = () => {
  const { story: storySlug } = useParams();
  const [isPublishing, setIsPublishing] = useState(false);
  const {
    stories,
    selectedStory,
    sections,
    setSections,
    selectStory,
    selectSection,
    updateStory,
    addSection,
    deleteSection: deleteSectionFromStore,
  } = useDashboardStore();

  useEffect(() => {
    const story = stories.find((s) => s.currentDraft?.slug === storySlug);
    if (!story) return;
    selectStory(story);
    selectSection(null);
    const fetchSections = async () => {
      const res = await fetch(`/api/stories/${story.id}/sections`);
      const data: SectionWithVersions[] = await res.json();
      setSections(data);
    };

    fetchSections();
  }, [storySlug, stories, selectStory, selectSection, setSections]);

  if (!selectedStory) return <p className="p-6">Loading...</p>;

  const { currentDraft } = selectedStory;
  if (!currentDraft) return <p className="p-6">No draft found</p>;
  const { title, slug } = currentDraft;

  const handlePublishStory = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(
        `/api/story-versions/${currentDraft.id}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed publishing the Story");
      }
      const updatedStory = await res.json();
      updateStory(updatedStory);
      toast.success("Story published successfully", {
        description: `Your story is now live!`,
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred while publishing the story");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (section: SectionWithVersions) => {
    //Delete section from the store
    deleteSectionFromStore(section.id);

    toast.success("Section has been removed", {
      description: `${section.currentDraft?.name} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Add the story back to the store
          addSection(section);
          toast.dismiss();
          toast.success("Section has been restored", {
            description: `${section.currentDraft?.name} has been restored.`,
          });
        },
      },
      onAutoClose: async () => {
        // Delete user from the database when the toast is closed
        const res = await deleteSection(section.id);
        if (!res.success) {
          toast.error("Failed to delete user");
          addSection(section);
        }
      },
    });
  };

  return (
    <>
      <DashboardHeader
        title={`${title} Sections`}
        addHref={`${slug}/new-section`}
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
        ]}
        addButtonLabel="New Section"
        onPublish={handlePublishStory}
        publishButtonLabel="Publish Story"
        isPublishing={isPublishing}
      />
      <div className="px-6">
        <DataTable
          columns={columns(slug, handleDelete)}
          data={sections}
          filterConfig={{
            columnKey: "name",
            placeholder: "Search by Name...",
          }}
        />
      </div>
    </>
  );
};

export default StoryPage;

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
import { publishStoryVersion } from "@/lib/actions/story-versions/publish-story-version";
import LivePreviewPanel from "@/components/storyCanvas/dashboard/preview/LivePreviewPanel";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [previewVisible, setPreviewVisible] = useState(false);

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

  if (!selectedStory)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  const { currentDraft } = selectedStory;
  if (!currentDraft) return <p className="p-6">No draft found</p>;
  const { title, slug } = currentDraft;

  const handlePublishStory = async () => {
    setIsPublishing(true);
    try {
      if (!selectedStory?.currentDraftId) {
        throw new Error("No current draft ID found for the selected story");
      }
      const result = await publishStoryVersion(selectedStory?.currentDraftId);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      updateStory(result.story);
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

  const handleTogglePreview = () => setPreviewVisible((prev) => !prev);

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
        onTogglePreview={handleTogglePreview}
        previewVisible={previewVisible}
      />
      <div className="flex flex-col lg:flex-row px-6 w-full gap-6 overflow-hidden">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            previewVisible ? "w-full lg:w-[40%]" : "w-full"
          }`}
        >
          <DataTable
            columns={columns(slug, handleDelete)}
            data={sections}
            enableSorting={true}
            isPreviewVisible={previewVisible}
          />
        </div>
        <AnimatePresence>
          <motion.div
            animate={{
              opacity: previewVisible ? 1 : 0,
              x: previewVisible ? 0 : 100,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "flex-1 overflow-hidden h-max-full min-w-full w-[100px] lg:w-[100px] lg:min-w-0",
              !previewVisible && "pointer-events-none"
            )}
          >
            <LivePreviewPanel
              slug={selectedStory.currentDraft?.slug ?? ""}
              draftSection={null}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default StoryPage;

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/SectionDataTableColumns";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { deleteSection } from "@/lib/actions/sections/delete-section";
import { publishStoryAndSections } from "@/lib/actions/stories/publish-story-and-sections";
import LivePreviewPanel from "@/components/storyCanvas/dashboard/preview/LivePreviewPanel";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateSectionVersionOrders } from "@/lib/actions/sections/update-section-orders";
import { publishSection } from "@/lib/actions/section-version/publish-section-version";
import { useStories } from "@/lib/swr/useStories";
import { useSections, Response } from "@/lib/swr/useSections";
import { SectionDraftMetadata } from "@/lib/dal/draft";

const StoryPage = () => {
  const { story: storySlug } = useParams();
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const { stories, isLoading: storiesLoading } = useStories();
  const selectedStory = stories.find((s) => s.currentDraft?.slug === storySlug);
  const {
    sections,
    isLoading: sectionsLoading,
    isError: sectionsError,
    mutate: mutateSections,
  } = useSections(selectedStory?.id);

  if (storiesLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!selectedStory || !selectedStory.currentDraft)
    return <p className="p-6">No story found</p>;

  const { title, slug } = selectedStory.currentDraft;

  const handlePublishStory = async () => {
    if (!selectedStory?.currentDraftId) {
      toast.error("No current draft ID found for this story");
      return;
    }
    setIsPublishing(true);
    try {
      const result = await publishStoryAndSections(
        selectedStory.currentDraftId,
        selectedStory.id
      );
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      // Update the SWR list
      mutateSections();

      toast.success("Story published successfully", {
        description: `Your story is now live!`,
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while publishing"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (section: SectionDraftMetadata) => {
    // Optimistically remove from UI
    mutateSections(
      (prev: Response | undefined) => {
        if (!prev || !("success" in prev) || !prev.sections) return prev;
        return {
          ...prev,
          sections: prev.sections.filter(
            (s) => s.currentDraft.id !== section.currentDraft.id
          ),
        };
      },
      { revalidate: false }
    );

    toast.success("Section has been removed", {
      description: `${section.currentDraft.name} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Optimistically add back on Undo click
          mutateSections(
            (prev): Response => {
              if (prev && "success" in prev) {
                return {
                  success: true,
                  sections: [...(prev.sections ?? []), section],
                };
              }

              return {
                success: true,
                sections: [section],
              };
            },
            { revalidate: false }
          );
        },
      },
      onAutoClose: async () => {
        // Remove drom DB
        const res = await deleteSection(section.id);
        if (!res.success) {
          toast.error("Failed to delete user");
          mutateSections(
            (prev): Response => {
              if (prev && "success" in prev && Array.isArray(prev.sections)) {
                return {
                  success: true,
                  sections: [...prev.sections, section],
                };
              }
              // Fallback
              return {
                success: true,
                sections: [section],
              };
            },
            { revalidate: false }
          );
        } else {
          // Ensure backend is in sync
          mutateSections();
        }
      },
    });
  };

  const handleTogglePreview = () => setPreviewVisible((prev) => !prev);

  const handleSaveDraft = async () => {
    const updates = sections.map((s) => ({
      versionId: s.currentDraft.id,
      order: s.currentDraft.order,
    }));

    const res = await updateSectionVersionOrders(updates);

    if ("error" in res) {
      toast.error(res.error);
    } else {
      toast.success("Order saved successfully");
    }
  };

  const handlePublishSection = async (currentDraftId: number | undefined) => {
    setIsPublishing(true);
    try {
      if (!currentDraftId) {
        throw new Error("Missing section ID");
      }

      const result = await publishSection(currentDraftId);

      if ("error" in result) {
        throw new Error(result.error);
      }
      // Update the SWR list
      mutateSections();

      toast.success("Section published successfully", {
        description: `Your section is now live!`,
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while publishing the section"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title={`${title} Sections`}
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
        ]}
        onPublish={handlePublishStory}
        publishButtonLabel="Publish Story"
        isPublishing={isPublishing}
        onTogglePreview={handleTogglePreview}
        previewVisible={previewVisible}
        onSaveDraft={handleSaveDraft}
      />
      <div className="flex flex-col lg:flex-row px-6 w-full gap-6 overflow-hidden">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            previewVisible ? "w-full lg:w-[40%]" : "w-full"
          }`}
        >
          <DataTable
            columns={columns(slug, handleDelete, handlePublishSection)}
            data={sections}
            enableSorting={true}
            isPreviewVisible={previewVisible}
            addHref={`${slug}/new-section`}
            addButtonLabel="New Section"
            dataIsLoading={sectionsLoading}
            dataFetchingError={sectionsError}
            selectedStoryId={selectedStory.id}
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
              previewVisible
                ? "relative visible w-full lg:w-[100px] lg:min-w-0"
                : "absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden",
              "flex-1 overflow-hidden h-max-full min-w-full"
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

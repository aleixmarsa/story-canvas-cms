"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EditSectionForm from "@/components/storyCanvas/dashboard/section/EditSectionForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/story-canvas";
import { toast } from "sonner";
import { publishSection } from "@/lib/actions/section-version/publish-section-version";
import LivePreviewPanel from "@/components/storyCanvas/dashboard/preview/LivePreviewPanel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStories } from "@/lib/swr/useStories";
import { useSections } from "@/lib/swr/useSections";
import { Loader2 } from "lucide-react";

const EditSectionPage = () => {
  const [previewVisible, setPreviewVisible] = useState(true);
  const router = useRouter();
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const formRef = useRef<(() => void) | undefined>(undefined);
  const skipNotFoundRedirect = useRef(false);
  const { story: storySlug, section: sectionSlug } = useParams();
  const { stories, isLoading: isLoadingStories } = useStories();
  const selectedStory = stories.find((s) => s.currentDraft?.slug === storySlug);

  const {
    sections,
    isLoading: isLoadingSections,
    mutate: mutateSections,
  } = useSections(selectedStory?.id);
  const selectedSection = sections.find(
    (s) => s.currentDraft?.slug === sectionSlug
  );

  const handlePublishSection = async () => {
    setIsPublishing(true);
    try {
      if (!selectedSection?.currentDraftId) {
        throw new Error("Missing section ID");
      }

      const result = await publishSection(selectedSection.currentDraftId);

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

  const handleTogglePreview = () => setPreviewVisible((prev) => !prev);

  useEffect(() => {
    if (
      !sectionSlug ||
      isLoadingSections ||
      isLoadingStories ||
      skipNotFoundRedirect.current
    )
      return;

    if (!selectedSection || !selectedStory) {
      router.push(ROUTES.stories);
    }
  }, [selectedSection, isLoadingSections]);

  const handleSaveDraft = async () => {
    if (formRef.current) {
      await formRef.current();
    }
  };

  if (isLoadingSections || !selectedSection || !selectedStory) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <DashboardHeader
        title="Edit Section"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `${ROUTES.stories}/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublishSection}
        saveDisabled={!formIsDirty}
        isSaving={formIsSubmitting}
        publishButtonLabel="Publish Section"
        isPublishing={isPublishing}
        onTogglePreview={handleTogglePreview}
        previewVisible={previewVisible}
      />
      <div className="flex flex-col lg:flex-row px-4 md:px-6 w-full gap-4 overflow-hidden">
        <div className="min-w-[30%] lg:min-w-[32rem]">
          <EditSectionForm
            formRef={formRef}
            onDirtyChange={setFormIsDirty}
            onSubmittingChange={setFormIsSubmitting}
            story={selectedStory}
            section={selectedSection}
            skipNotFoundRedirect={skipNotFoundRedirect}
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

export default EditSectionPage;

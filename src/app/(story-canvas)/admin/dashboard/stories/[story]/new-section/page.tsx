"use client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateSectionForm from "@/components/storyCanvas/dashboard/section/CreateSectionForm";
import { useRef, useState } from "react";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Loader2 } from "lucide-react";
import { useStories } from "@/lib/swr/useStories";
import { useParams } from "next/navigation";
import LivePreviewPanel from "@/components/storyCanvas/dashboard/preview/LivePreviewPanel";
import { cn } from "@/lib/utils";

const NewSectionPage = () => {
  const [previewVisible, setPreviewVisible] = useState(true);
  const formRef = useRef<(() => void) | undefined>(undefined);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const { story: storySlug } = useParams();
  const { stories } = useStories();
  const selectedStory = stories.find((s) => s.currentDraft?.slug === storySlug);

  const handleSaveDraft = async () => {
    if (formRef.current) {
      await formRef.current();
    }
  };

  const handleTogglePreview = () => setPreviewVisible((prev) => !prev);

  if (!selectedStory)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <>
      <DashboardHeader
        title="New Section"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `${ROUTES.stories}/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={handleSaveDraft}
        saveDisabled={!formIsDirty}
        isSaving={formIsSubmitting}
        onTogglePreview={handleTogglePreview}
        previewVisible={previewVisible}
      />
      <div className="flex flex-col lg:flex-row px-6 w-full gap-4 overflow-hidden">
        <div className="min-w-[30%] lg:min-w-[32rem]">
          <CreateSectionForm
            formRef={formRef}
            onDirtyChange={setFormIsDirty}
            onSubmittingChange={setFormIsSubmitting}
            story={selectedStory}
          />
        </div>
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            previewVisible
              ? "relative visible opacity-100 translate-x-0 w-full lg:w-[100px] lg:min-w-0"
              : "absolute opacity-0 pointer-events-none translate-x-100 w-0 h-0 overflow-hidden",
            "flex-1 overflow-hidden h-max-full"
          )}
        >
          <LivePreviewPanel
            slug={selectedStory.currentDraft?.slug ?? ""}
            draftSection={null}
          />
        </div>
      </div>
    </>
  );
};

export default NewSectionPage;

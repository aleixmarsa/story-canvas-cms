"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/story-canvas";
import { publishStoryVersion } from "@/lib/actions/story-versions/publish-story-version";
import { useStories } from "@/lib/swr/useStories";

const EditStoryPage = () => {
  const { story: storySlug } = useParams();
  const router = useRouter();
  const { stories, isLoading, mutate: mutateStories } = useStories();
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const skipNotFoundRedirect = useRef(false);

  const selectedStory = stories.find((s) => s.currentDraft?.slug === storySlug);

  useEffect(() => {
    if (!storySlug || isLoading || skipNotFoundRedirect.current) return;

    if (!selectedStory) {
      router.push(ROUTES.stories);
    }
  }, [selectedStory, isLoading]);

  const handlePublishStory = async () => {
    if (!selectedStory?.currentDraftId) {
      toast.error("No current draft ID found for this story");
      return;
    }
    setIsPublishing(true);
    try {
      const result = await publishStoryVersion(selectedStory.currentDraftId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      // Update the SWR list
      mutateStories();

      toast.success("Story metadata published successfully", {
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

  if (isLoading || !selectedStory) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Edit Story Metadata"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
        ]}
        onPublish={handlePublishStory}
        onSaveDraft={() => formRef.current?.requestSubmit()}
        saveDisabled={!isDirty}
        isSaving={isSubmitting}
        publishButtonLabel="Publish Story Metadata"
        isPublishing={isPublishing}
      />
      <div className="px-4 md:px-6 ">
        <EditStoryForm
          story={selectedStory}
          setDirty={setDirty}
          setIsSubmitting={setIsSubmitting}
          ref={formRef}
          skipNotFoundRedirect={skipNotFoundRedirect}
        />
      </div>
    </>
  );
};

export default EditStoryPage;

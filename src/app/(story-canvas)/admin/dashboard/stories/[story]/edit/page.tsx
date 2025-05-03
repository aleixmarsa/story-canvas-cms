"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { publishStoryVersion } from "@/lib/actions/story-versions/publish-story-version";
import { Loader2 } from "lucide-react";

const EditStoryPage = () => {
  const { stories, selectStory, selectedStory, updateStory } =
    useDashboardStore();
  const { story: storySlug } = useParams();
  const router = useRouter();
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

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

  useEffect(() => {
    if (!storySlug || stories.length === 0) return;
    const found = stories.find((s) => s.currentDraft?.slug === storySlug);
    if (found) {
      selectStory(found);
    }
  }, [stories, storySlug]);

  useEffect(() => {
    if (!storySlug || stories.length === 0) return;
    const found = stories.find((s) => s.currentDraft?.slug === storySlug);
    if (!found) {
      router.push(ROUTES.dashboard);
    }
  }, [storySlug]);

  if (!selectedStory)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      <DashboardHeader
        title="Edit Story"
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
      <div className="px-6">
        <EditStoryForm
          setDirty={setDirty}
          setIsSubmitting={setIsSubmitting}
          ref={formRef}
        />
      </div>
    </>
  );
};

export default EditStoryPage;

"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

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
      const res = await fetch(
        `/api/story-versions/${selectedStory?.currentDraftId}/publish`,
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
    } catch (err) {
      console.error("Failed to publish the story", err);
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
      router.push("/admin/dashboard");
    }
  }, [storySlug]);

  if (!selectedStory) return null;

  return (
    <>
      <DashboardHeader
        title="Edit Story"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        onPublish={handlePublishStory}
        onSaveDraft={() => formRef.current?.requestSubmit()}
        saveDisabled={!isDirty}
        isSaving={isSubmitting}
        publishButtonLabel="Publish Story"
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

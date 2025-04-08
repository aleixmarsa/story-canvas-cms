"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const EditStoryPage = () => {
  const { stories, selectStory, selectedStory } = useCmsStore();
  const { story: storySlug } = useParams();
  const router = useRouter();
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

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
        onPublish={() => {}}
        onSaveDraft={() => formRef.current?.requestSubmit()}
        saveDisabled={!isDirty}
        isSaving={isSubmitting}
        publishButtonLabel="Publish Story"
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

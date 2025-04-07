"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const EditStoryPage = () => {
  const { stories } = useCmsStore();
  const { story: storySlug } = useParams();
  const router = useRouter();
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const [story, setStory] = useState<{
    id: number;
    createdBy: string;
    title: string;
    slug: string;
    currentDraftId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!storySlug) {
      router.push("/admin/dashboard");
      return;
    }

    const found = stories.find((s) => s.currentDraft?.slug === storySlug);
    if (!found) {
      router.push("/admin/dashboard");
      return;
    }
    const { id, currentDraft, currentDraftId } = found;
    if (!currentDraft) {
      router.push("/admin/dashboard");
      return;
    }
    const { title, slug, createdBy } = currentDraft;
    setStory({
      id,
      title,
      slug,
      createdBy,
      currentDraftId,
    });
  }, [storySlug, stories, router]);

  if (!story) return null;

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
          story={story}
          setDirty={setDirty}
          setIsSubmitting={setIsSubmitting}
          ref={formRef}
        />
      </div>
    </>
  );
};

export default EditStoryPage;

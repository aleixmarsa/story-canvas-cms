"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditStoryForm from "@/components/storyCanvas/dashboard/story/EditStoryForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const EditStoryPage = () => {
  const { stories } = useCmsStore();
  const { story: storySlug } = useParams();
  const router = useRouter();

  const [story, setStory] = useState<{
    id: number;
    createdBy: string;
    title: string;
    slug: string;
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
    const { currentDraft } = found;
    if (!currentDraft) {
      router.push("/admin/dashboard");
      return;
    }
    const { id, title, slug, createdBy } = currentDraft;
    setStory({
      id,
      title,
      slug,
      createdBy,
    });
  }, [storySlug, stories, router]);

  if (!story) return null;

  return (
    <>
      <DashboardHeader
        title="Edit Story"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        onSaveDraft={() => {}}
        onPublish={() => {}}
      />
      <div className="px-6">
        <EditStoryForm story={story} onCancelNavigateTo="/admin/dashboard" />
      </div>
    </>
  );
};

export default EditStoryPage;

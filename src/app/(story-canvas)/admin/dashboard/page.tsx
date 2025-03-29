"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import { Story } from "@prisma/client";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/DataTableColumn";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateStoryForm from "@/components/storyCanvas/dashboard/CreateStoryForm";

export default function DashboardPage() {
  const router = useRouter();
  const { stories, setStories, selectStory, setSections, selectSection } =
    useCmsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    };

    fetchStories();
    selectStory(null);
    selectSection(null);
  }, [setStories, selectStory, selectSection]);

  const handleRowClick = async (story: Story) => {
    selectStory(story);
    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);
    router.push(`/admin/dashboard/${story.slug}`);
  };

  return (
    <>
      {showCreateForm ? (
        <>
          <DashboardHeader title="New Story" />
          <CreateStoryForm onCancel={() => setShowCreateForm(false)} />
        </>
      ) : (
        <>
          <DashboardHeader
            title="Stories"
            buttonLabel="New Story"
            buttonOnClick={() => setShowCreateForm(true)}
          />
          <DataTable
            columns={columns}
            data={stories}
            onRowClick={handleRowClick}
          />
        </>
      )}
    </>
  );
}

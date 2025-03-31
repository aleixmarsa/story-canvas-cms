"use client";

import { useEffect, useState } from "react";
import { useCmsStore } from "@/stores/cms-store";
import DataTable from "@/components/storyCanvas/dashboard/dataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/dataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateStoryForm from "@/components/storyCanvas/dashboard/story/CreateStoryForm";

export default function DashboardPage() {
  const { stories, setStories, selectStory, selectSection } = useCmsStore();
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
            getRowLink={(row) => `/admin/dashboard/${row.slug}`}
          />
        </>
      )}
    </>
  );
}

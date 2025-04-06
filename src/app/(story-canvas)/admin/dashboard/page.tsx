"use client";

import { useEffect } from "react";
import { useCmsStore } from "@/stores/cms-store";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { StoryWithVersions } from "@/types/story";

const DashboardPage = () => {
  const { stories, setStories, selectStory, selectSection } = useCmsStore();

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data: StoryWithVersions[] = await res.json();
      setStories(data);
    };

    fetchStories();
    selectStory(null);
    selectSection(null);
  }, [setStories, selectStory, selectSection]);

  return (
    <>
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        addHref="/admin/dashboard/new-story"
        addButtonLabel="New Story"
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={stories}
          getRowLink={(row) => `/admin/dashboard/${row.currentDraft?.slug}`}
          getEditLink={(row) =>
            `/admin/dashboard/${row.currentDraft?.slug}/edit`
          }
        />
      </div>
    </>
  );
};

export default DashboardPage;

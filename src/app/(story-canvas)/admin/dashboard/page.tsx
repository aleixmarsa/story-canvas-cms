"use client";

import { useEffect } from "react";
import { useCmsStore } from "@/stores/cms-store";
import DataTable from "@/components/storyCanvas/dashboard/dataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/dataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const DashboardPage = () => {
  const { stories, setStories, selectStory, selectSection } = useCmsStore();

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
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        addHref="/admin/dashboard/new-story"
        addButtonLabel="New Story"
      />
      <DataTable
        columns={columns}
        data={stories}
        getRowLink={(row) => `/admin/dashboard/${row.slug}`}
        getEditLink={(row) => `/admin/dashboard/${row.slug}/edit`}
      />
    </>
  );
};

export default DashboardPage;

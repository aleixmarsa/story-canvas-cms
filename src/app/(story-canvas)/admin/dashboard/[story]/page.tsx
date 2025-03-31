"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/dataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/dataTable/SectionDataTableColumns";

const StoryPage = () => {
  const { story: storySlug } = useParams();
  const {
    stories,
    selectedStory,
    sections,
    setSections,
    selectStory,
    selectSection,
  } = useCmsStore();

  useEffect(() => {
    const story = stories.find((s) => s.slug === storySlug);
    if (!story) return;

    selectStory(story);
    selectSection(null);

    const fetchSections = async () => {
      const res = await fetch(`/api/sections?storyId=${story.id}`);
      const data = await res.json();
      setSections(data);
    };

    fetchSections();
  }, [storySlug, stories, selectStory, selectSection, setSections]);

  if (!selectedStory) return <p className="p-6">Loading...</p>;

  return (
    <>
      <DashboardHeader
        title={`${selectedStory.title}  Sections`}
        href={`${selectedStory.slug}/new-section`}
        linkText="New Section"
      />
      <DataTable
        columns={columns}
        data={sections}
        getRowLink={(row) =>
          `/admin/dashboard/${selectedStory.slug}/${row.slug}`
        }
      />
    </>
  );
};

export default StoryPage;

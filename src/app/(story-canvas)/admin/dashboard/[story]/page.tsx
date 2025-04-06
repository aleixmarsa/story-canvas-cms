"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/SectionDataTableColumns";

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
    const story = stories.find((s) => s.currentDraft?.slug === storySlug);
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
        title={`${selectedStory.currentDraft?.title} Sections`}
        addHref={`${selectedStory.currentDraft?.slug}/new-section`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        addButtonLabel="New Section"
        onSaveDraft={() => {}}
        onPublish={() => {}}
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={sections}
          getEditLink={(row) =>
            `/admin/dashboard/${selectedStory.slug}/${row.slug}`
          }
        />
      </div>
    </>
  );
};

export default StoryPage;

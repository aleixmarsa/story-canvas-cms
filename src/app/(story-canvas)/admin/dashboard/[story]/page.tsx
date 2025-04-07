"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/SectionDataTableColumns";
import { SectionWithVersions } from "@/types/section";

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
      const res = await fetch(`/api/stories/${story.id}/sections`);
      const data: SectionWithVersions[] = await res.json();
      setSections(data);
    };

    fetchSections();
  }, [storySlug, stories, selectStory, selectSection, setSections]);

  if (!selectedStory) return <p className="p-6">Loading...</p>;

  const { currentDraft } = selectedStory;
  if (!currentDraft) return <p className="p-6">No draft found</p>;
  const { title, slug } = currentDraft;

  return (
    <>
      <DashboardHeader
        title={`${title} Sections`}
        addHref={`${slug}/new-section`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        addButtonLabel="New Section"
        onPublish={() => {}}
        publishButtonLabel="Publish Story"
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={sections}
          getEditLink={(row) =>
            `/admin/dashboard/${slug}/${row.currentDraft?.id}`
          }
        />
      </div>
    </>
  );
};

export default StoryPage;

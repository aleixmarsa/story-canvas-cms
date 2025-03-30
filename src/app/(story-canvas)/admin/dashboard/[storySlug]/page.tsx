"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import DataTable from "@/components/storyCanvas/dashboard/dataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/dataTable/SectionDataTableColumns";
import CreateSectionForm from "@/components/storyCanvas/dashboard/section/CreateSectionForm";
export default function StoryPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { slug } = useParams();
  const {
    stories,
    selectedStory,
    sections,
    setSections,
    selectStory,
    selectSection,
  } = useCmsStore();

  useEffect(() => {
    const story = stories.find((s) => s.slug === slug);
    if (!story) return;

    selectStory(story);
    selectSection(null);

    const fetchSections = async () => {
      const res = await fetch(`/api/sections?storyId=${story.id}`);
      const data = await res.json();
      setSections(data);
    };

    fetchSections();
  }, [slug, stories, selectStory, selectSection, setSections]);

  if (!selectedStory) return <p className="p-6">Loading...</p>;

  return (
    <>
      {showCreateForm ? (
        <>
          <DashboardHeader title="New Section" />
          <CreateSectionForm />
        </>
      ) : (
        <>
          <DashboardHeader
            title={`${selectedStory.title}  Sections`}
            buttonLabel="New Section"
            buttonOnClick={() => setShowCreateForm(true)}
          />
          <DataTable
            columns={columns}
            data={sections}
            onRowClick={() => console.log("test")}
          />
        </>
      )}
    </>
  );
}

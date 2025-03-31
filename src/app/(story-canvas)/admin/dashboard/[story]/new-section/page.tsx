"use client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateSectionForm from "@/components/storyCanvas/dashboard/section/CreateSectionForm";
import { useCmsStore } from "@/stores/cms-store";

const NewSectionPage = () => {
  const { selectedStory } = useCmsStore();

  if (!selectedStory) return <p className="p-6">Loading...</p>;

  return (
    <>
      <DashboardHeader
        title="New Section"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          {
            label: selectedStory.title,
            href: `/admin/dashboard/${selectedStory.slug}`,
          },
        ]}
        onPublish={() => {}}
        onSaveDraft={() => {}}
      />

      <CreateSectionForm />
    </>
  );
};

export default NewSectionPage;

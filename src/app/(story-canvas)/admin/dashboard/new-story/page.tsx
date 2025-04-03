"use client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateStoryForm from "@/components/storyCanvas/dashboard/story/CreateStoryForm";

const NewStoryPage = () => {
  return (
    <>
      <DashboardHeader
        title="New Story"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        onPublish={() => {}}
        onSaveDraft={() => {}}
      />
      <div className="px-6">
        <CreateStoryForm onCancelNavigateTo="/admin/dashboard" />
      </div>
    </>
  );
};

export default NewStoryPage;

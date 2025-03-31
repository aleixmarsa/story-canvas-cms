import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateStoryForm from "@/components/storyCanvas/dashboard/story/CreateStoryForm";

const NewStoryPage = () => {
  return (
    <>
      <DashboardHeader title="New Story" />
      <CreateStoryForm onCancelNavigateTo="/admin/dashboard" />
    </>
  );
};

export default NewStoryPage;

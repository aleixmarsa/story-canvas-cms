import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateSectionForm from "@/components/storyCanvas/dashboard/section/CreateSectionForm";

const NewSectionPage = () => {
  return (
    <>
      <DashboardHeader title="New Section" />
      <CreateSectionForm />
    </>
  );
};

export default NewSectionPage;

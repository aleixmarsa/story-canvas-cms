import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { getCurrentUser } from "@/lib/dal/auth";
import StoryTableWrapper from "@/components/storyCanvas/dashboard/story/StoryTableWrapper";
import { redirect } from "next/navigation";

const StoriesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.login);
  }

  return (
    <>
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
      />
      <StoryTableWrapper currentUser={currentUser} />
    </>
  );
};

export default StoriesPage;

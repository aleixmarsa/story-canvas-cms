import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { getCurrentUser } from "@/lib/dal/auth";
import StoryTableWrapper from "@/components/storyCanvas/dashboard/story/StoryTableWrapper";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

const StoriesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.login);
  }

  const isAdmin = currentUser.role === Role.ADMIN;

  return (
    <>
      {isAdmin && (
        <DashboardHeader
          title="Stories"
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        />
      )}
      {!isAdmin && (
        <DashboardHeader
          title="Stories"
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        />
      )}
      <StoryTableWrapper currentUser={currentUser} />
    </>
  );
};

export default StoriesPage;

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal/auth";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Role } from "@prisma/client";

const NewUserLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.login);
  }

  if (currentUser.role !== Role.ADMIN) {
    redirect(ROUTES.users);
  }

  return <>{children}</>;
};

export default NewUserLayout;

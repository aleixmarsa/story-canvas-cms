import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal/auth";
import { Role } from "@prisma/client";
import { ROUTES } from "@/lib/constants/storyCanvas";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  if (user.role !== Role.ADMIN) {
    redirect(ROUTES.dashboard);
  }
  return <>{children}</>;
};

export default DashboardLayout;

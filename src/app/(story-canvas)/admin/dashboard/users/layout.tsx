import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal/auth";
import { ROUTES } from "@/lib/constants/storyCanvas";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }
  return <>{children}</>;
};

export default UsersLayout;

import { DashboardSidebar } from "@/components/storyCanvas/dashboard/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { Role } from "@prisma/client";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <SidebarProvider>
      <DashboardSidebar userRole={user?.role ?? Role.EDITOR} />
      <SidebarInset>
        <div className="flex-1">
          <div className="space-y-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

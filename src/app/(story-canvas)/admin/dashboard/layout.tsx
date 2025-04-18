import { DashboardSidebar } from "@/components/storyCanvas/dashboard/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/dal/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <div className="flex-1">
          <div className="space-y-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

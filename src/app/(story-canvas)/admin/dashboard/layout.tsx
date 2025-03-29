import Sidebar from "@/components/storyCanvas/dashboard/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

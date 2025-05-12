import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/story-canvas";

const DashboardPage = () => {
  return (
    <>
      <DashboardHeader title="Dashboard" breadcrumbs={[]} />
      <div className="px-4 md:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome to the dashboard</h1>
          <p className="text-muted-foreground">
            Manage your content and users. Choose a section to get started.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
          <Link href={ROUTES.stories} data-testid="dashboard-stories-cards">
            <Card className="hover:bg-muted/50 h-full transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <CardTitle>Stories</CardTitle>
                <p className="text-muted-foreground mt-2">
                  View and manage all your stories.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={ROUTES.users} data-testid="dashboard-users-cards">
            <Card className="hover:bg-muted/50 h-full transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <CardTitle>Users</CardTitle>
                <p className="text-muted-foreground mt-2">
                  View and manage users.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

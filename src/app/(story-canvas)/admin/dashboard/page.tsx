"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/dashboard";

const DashboardPage = () => {
  const { stories } = useDashboardStore();
  return (
    <>
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        addHref={`${ROUTES.dashboard}/new-story`}
        addButtonLabel="New Story"
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={stories}
          getRowLink={(row) => `${ROUTES.dashboard}/${row.currentDraft?.slug}`}
          getEditLink={(row) =>
            `${ROUTES.dashboard}/${row.currentDraft?.slug}/edit`
          }
        />
      </div>
    </>
  );
};

export default DashboardPage;

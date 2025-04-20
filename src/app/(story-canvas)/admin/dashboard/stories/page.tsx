"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/storyCanvas";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";

const DashboardPage = () => {
  const { stories } = useDashboardStore();
  return (
    <>
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        addHref={`${ROUTES.stories}/new`}
        addButtonLabel="New Story"
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={stories}
          getRowLink={(row) => `${ROUTES.stories}/${row.currentDraft?.slug}`}
          filterConfig={{
            columnKey: "title",
            placeholder: "Search by Title...",
          }}
        />
      </div>
    </>
  );
};

export default DashboardPage;

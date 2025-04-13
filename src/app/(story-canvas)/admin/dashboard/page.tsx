"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/StoryDataTableColumns";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const DashboardPage = () => {
  const { stories } = useDashboardStore();
  return (
    <>
      <DashboardHeader
        title="Stories"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }]}
        addHref="/admin/dashboard/new-story"
        addButtonLabel="New Story"
      />
      <div className="px-6">
        <DataTable
          columns={columns}
          data={stories}
          getRowLink={(row) => `/admin/dashboard/${row.currentDraft?.slug}`}
          getEditLink={(row) =>
            `/admin/dashboard/${row.currentDraft?.slug}/edit`
          }
        />
      </div>
    </>
  );
};

export default DashboardPage;

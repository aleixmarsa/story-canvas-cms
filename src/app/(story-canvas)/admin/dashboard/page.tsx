"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/stores/cms-store";
import { Story } from "@prisma/client";
import DataTable from "@/components/storyCanvas/dashboard/DataTable/DataTable";
import { columns } from "@/components/storyCanvas/dashboard/DataTable/DataTableColumn";

export default function DashboardPage() {
  const router = useRouter();
  const { stories, setStories, selectStory, setSections, selectSection } =
    useCmsStore();

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    };

    fetchStories();
    selectStory(null);
    selectSection(null);
  }, [setStories, selectStory, selectSection]);

  const handleRowClick = async (story: Story) => {
    selectStory(story);
    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);
    router.push(`/admin/dashboard/${story.slug}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
        </div>
        <Button onClick={() => router.push("/admin/dashboard/new")}>
          New story
        </Button>
      </div>
      <DataTable columns={columns} data={stories} onRowClick={handleRowClick} />
    </div>
  );
}

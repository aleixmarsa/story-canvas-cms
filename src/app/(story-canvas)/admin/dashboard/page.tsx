"use client";

import { useEffect } from "react";
import { useCmsStore } from "@/stores/cms-store";
import CreateStoryForm from "@/components/storyCanvas/dashboard/CreateStoryForm";
import CreateSectionForm from "@/components/storyCanvas/dashboard/CreateSectionForm";
import EditSectionForm from "@/components/storyCanvas/dashboard/EditSectionForm";

export default function DashboardPage() {
  const { setStories, selectedStory, selectedSection } = useCmsStore();

  // Fetch projects once
  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    };
    fetchStories();
  }, [setStories]);

  return (
    <main className="flex-1 p-8">
      {!selectedStory && !selectedSection && (
        <div>
          <h2 className="text-xl font-bold mb-4">New story</h2>
          <CreateStoryForm />
        </div>
      )}

      {selectedStory && !selectedSection && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            New section for {selectedStory.title}
          </h2>
          <CreateSectionForm storyId={selectedStory.id} />
        </div>
      )}

      {selectedSection && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Edit Section: {selectedSection.type}
          </h2>
          <EditSectionForm section={selectedSection} />
        </div>
      )}
    </main>
  );
}

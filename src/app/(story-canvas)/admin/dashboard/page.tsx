"use client";

import { useEffect } from "react";
import { useCmsStore } from "@/stores/cms-store";
import CreateStoryForm from "@/components/storyCanvas/dashboard/CreateStoryForm";
import CreateProjectForm from "@/components/storyCanvas/dashboard/CreateProjectForm";
import CreateSectionForm from "@/components/storyCanvas/dashboard/CreateSectionForm";
import EditSectionForm from "@/components/storyCanvas/dashboard/EditSectionForm";

export default function DashboardPage() {
  const { selectedProject, selectedStory, selectedSection, setProjects } =
    useCmsStore();

  // Fetch projects once
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, [setProjects]);

  return (
    <main className="flex-1 p-8">
      {!selectedProject && (
        <div>
          <h2 className="text-xl font-bold mb-4">New project</h2>
          <CreateProjectForm />
        </div>
      )}

      {selectedProject && !selectedStory && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            New story for {selectedProject.name}
          </h2>
          <CreateStoryForm projectId={selectedProject.id} />
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

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/stores/cms-store";

export default function Sidebar() {
  const {
    projects,
    stories,
    sections,
    selectedProject,
    selectedStory,
    selectedSection,
    setProjects,
    setStories,
    setSections,
    selectProject,
    selectStory,
    selectSection,
    resetSelection,
    resetStoryAndSection,
  } = useCmsStore();

  // Loads project once
  useEffect(() => {
    if (projects.length === 0) {
      const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      };
      fetchProjects();
    }
  }, [projects.length, setProjects]);

  // Fetches only if selected project is different to avoid unnecessary fetches
  const handleProjectSelect = async (projectId: number) => {
    if (selectedProject?.id === projectId) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    selectProject(project);

    const res = await fetch(`/api/stories?projectId=${project.id}`);
    const data = await res.json();
    setStories(data);
  };

  // Fetches only if selected story is different to avoid unnecessary fetches
  const handleStorySelect = async (storyId: number) => {
    if (selectedStory?.id === storyId) return;
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    selectStory(story);

    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);
  };

  return (
    <aside className="w-64 border-r px-4 py-8 space-y-4">
      <p className="text-md font-semibold">
        <button
          onClick={resetSelection}
          className="hover:underline cursor-pointer"
        >
          Projects
        </button>
        {selectedProject && (
          <>
            {" "}
            ›{" "}
            <button
              onClick={resetStoryAndSection}
              className="hover:underline cursor-pointer"
            >
              {selectedProject.name}
            </button>
          </>
        )}
        {selectedStory && (
          <>
            {" "}
            › <span className="font-bold">{selectedStory.title}</span>
          </>
        )}
      </p>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Button
              variant={
                selectedProject?.id === project.id ? "default" : "outline"
              }
              className="w-full justify-start cursor-pointer"
              onClick={() => handleProjectSelect(project.id)}
            >
              {project.name}
            </Button>

            {selectedProject?.id === project.id && (
              <ul className="ml-4 mt-2 space-y-2">
                {stories.map((story) => (
                  <li key={story.id}>
                    <Button
                      variant={
                        selectedStory?.id === story.id ? "default" : "outline"
                      }
                      className="w-full justify-start cursor-pointer"
                      onClick={() => handleStorySelect(story.id)}
                    >
                      {story.title}
                    </Button>

                    {selectedStory?.id === story.id && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {sections.map((section) => (
                          <li key={section.id}>
                            <Button
                              variant={
                                selectedSection?.id === section.id
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-start cursor-pointer"
                              onClick={() => selectSection(section)}
                            >
                              {section.type}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

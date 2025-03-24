"use client";

import { Button } from "@/components/ui/button";
import { Project, Story, Section } from "@prisma/client";

interface SidebarProps {
  projects: Project[];
  stories: Story[];
  sections: Section[];
  selectedProject: Project | null;
  selectedStory: Story | null;
  selectedSection: Section | null;
  onProjectSelect: (project: Project) => void;
  onStorySelect: (story: Story) => void;
  onSectionSelect: (section: Section) => void;
  resetSelection: () => void;
  resetStoryAndSection: () => void;
}

export default function Sidebar({
  projects,
  stories,
  sections,
  selectedProject,
  selectedStory,
  selectedSection,
  onProjectSelect,
  onStorySelect,
  onSectionSelect,
  resetSelection,
  resetStoryAndSection,
}: SidebarProps) {
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
              onClick={() => onProjectSelect(project)}
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
                      onClick={() => onStorySelect(story)}
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
                              onClick={() => onSectionSelect(section)}
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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Project, Story, Section } from "@prisma/client";
import CreateStoryForm from "@/components/CreateStoryForm";
import CreateProjectForm from "@/components/CreateProjectForm";
import CreateSectionForm from "@/components/CreateSectionForm";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    setSelectedStory(null);
    setSelectedSection(null);
    const res = await fetch(`/api/stories?projectId=${project.id}`);
    const data = await res.json();
    setStories(data);
  };

  const handleStorySelect = async (story: Story) => {
    setSelectedStory(story);
    setSelectedSection(null);
    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r px-4 py-8 space-y-4">
        <p className="text-md font-semibold">
          <button
            className="hover:underline cursor-pointer"
            onClick={() => {
              setSelectedProject(null);
              setSelectedStory(null);
              setSelectedSection(null);
            }}
          >
            Projects
          </button>

          {selectedProject && (
            <>
              {" "}
              ›{" "}
              <button
                className="hover:underline  cursor-pointer"
                onClick={() => {
                  setSelectedStory(null);
                  setSelectedSection(null);
                }}
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
                onClick={() => handleProjectSelect(project)}
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
                        onClick={() => handleStorySelect(story)}
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
                                onClick={() => handleSectionSelect(section)}
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        {selectedSection && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Edit Section: {selectedSection.type}
            </h2>
          </div>
        )}
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
            <CreateStoryForm
              projectId={selectedProject.id}
              onStoryCreated={() => handleProjectSelect(selectedProject)} // Refresca les stories
            />
          </div>
        )}
        {selectedStory && !selectedSection && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              New sections for {selectedStory.title}
            </h2>
            <CreateSectionForm
              storyId={selectedStory.id}
              onSectionCreated={() => handleStorySelect(selectedStory)} // Refresca sections
            />
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Project, Story, Section } from "@prisma/client";
import CreateStoryForm from "@/components/storyCanvas/dashboard/CreateStoryForm";
import CreateProjectForm from "@/components/storyCanvas/dashboard/CreateProjectForm";
import CreateSectionForm from "@/components/storyCanvas/dashboard/CreateSectionForm";
import EditSectionForm from "@/components/storyCanvas/dashboard/EditSectionForm";
import Sidebar from "@/components/storyCanvas/dashboard/Sidebar";

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
      <Sidebar
        projects={projects}
        stories={stories}
        sections={sections}
        selectedProject={selectedProject}
        selectedStory={selectedStory}
        selectedSection={selectedSection}
        onProjectSelect={handleProjectSelect}
        onStorySelect={handleStorySelect}
        onSectionSelect={handleSectionSelect}
        resetSelection={() => {
          setSelectedProject(null);
          setSelectedStory(null);
          setSelectedSection(null);
        }}
        resetStoryAndSection={() => {
          setSelectedStory(null);
          setSelectedSection(null);
        }}
      />

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
            <CreateStoryForm
              projectId={selectedProject.id}
              onStoryCreated={() => handleProjectSelect(selectedProject)}
            />
          </div>
        )}

        {selectedStory && !selectedSection && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              New section for {selectedStory.title}
            </h2>
            <CreateSectionForm
              storyId={selectedStory.id}
              onSectionCreated={() => handleStorySelect(selectedStory)}
            />
          </div>
        )}

        {selectedSection && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Edit Section: {selectedSection.type}
            </h2>
            <EditSectionForm
              section={selectedSection}
              onSectionUpdated={() => handleStorySelect(selectedStory!)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

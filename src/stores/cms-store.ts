import { create } from "zustand";
import { Project, Story, Section } from "@prisma/client";

interface CmsState {
  projects: Project[];
  stories: Story[];
  sections: Section[];
  selectedProject: Project | null;
  selectedStory: Story | null;
  selectedSection: Section | null;

  // Setters
  setProjects: (projects: Project[]) => void;
  setStories: (stories: Story[]) => void;
  setSections: (sections: Section[]) => void;

  // Selectors
  selectProject: (project: Project | null) => void;
  selectStory: (story: Story | null) => void;
  selectSection: (section: Section | null) => void;

  resetSelection: () => void;
  resetStoryAndSection: () => void;

  // CRUD Helpers
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: number) => void;

  addStory: (story: Story) => void;
  updateStory: (story: Story) => void;
  deleteStory: (storyId: number) => void;

  addSection: (section: Section) => void;
  updateSection: (section: Section) => void;
  deleteSection: (sectionId: number) => void;
}

export const useCmsStore = create<CmsState>((set) => ({
  projects: [],
  stories: [],
  sections: [],
  selectedProject: null,
  selectedStory: null,
  selectedSection: null,

  setProjects: (projects) => set({ projects }),
  setStories: (stories) => set({ stories }),
  setSections: (sections) => set({ sections }),

  selectProject: (project) =>
    set({
      selectedProject: project,
      selectedStory: null,
      selectedSection: null,
    }),
  selectStory: (story) =>
    set((state) => ({ ...state, selectedStory: story, selectedSection: null })),
  selectSection: (section) =>
    set((state) => ({ ...state, selectedSection: section })),

  resetSelection: () =>
    set({ selectedProject: null, selectedStory: null, selectedSection: null }),
  resetStoryAndSection: () =>
    set((state) => ({ ...state, selectedStory: null, selectedSection: null })),

  // CRUD Helpers

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),

  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
  updateStory: (story) =>
    set((state) => ({
      stories: state.stories.map((s) => (s.id === story.id ? story : s)),
    })),
  deleteStory: (storyId) =>
    set((state) => ({
      stories: state.stories.filter((s) => s.id !== storyId),
    })),

  addSection: (section) =>
    set((state) => ({ sections: [...state.sections, section] })),
  updateSection: (section) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === section.id ? section : s)),
    })),
  deleteSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
    })),
}));

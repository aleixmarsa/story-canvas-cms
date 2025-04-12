import { create } from "zustand";
import { StoryWithVersions } from "@/types/story";
import { SectionWithVersions } from "@/types/section";

interface DashboardState {
  stories: StoryWithVersions[];
  sections: SectionWithVersions[];
  selectedStory: StoryWithVersions | null;
  selectedSection: SectionWithVersions | null;

  // Setters
  setStories: (stories: StoryWithVersions[]) => void;
  setSections: (sections: SectionWithVersions[]) => void;

  // Selectors
  selectStory: (story: StoryWithVersions | null) => void;
  selectSection: (section: SectionWithVersions | null) => void;

  resetSelection: () => void;
  resetStoryAndSection: () => void;

  // CRUD Helpers

  addStory: (story: StoryWithVersions) => void;
  updateStory: (story: StoryWithVersions) => void;
  deleteStory: (storyId: number) => void;

  addSection: (section: SectionWithVersions) => void;
  updateSection: (section: SectionWithVersions) => void;
  deleteSection: (sectionId: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stories: [],
  sections: [],
  selectedStory: null,
  selectedSection: null,

  setStories: (stories) => set({ stories }),
  setSections: (sections) => set({ sections }),

  selectStory: (story) =>
    set((state) => ({ ...state, selectedStory: story, selectedSection: null })),
  selectSection: (section) =>
    set((state) => ({ ...state, selectedSection: section })),

  resetSelection: () => set({ selectedStory: null, selectedSection: null }),
  resetStoryAndSection: () =>
    set((state) => ({ ...state, selectedStory: null, selectedSection: null })),

  // CRUD Helpers

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

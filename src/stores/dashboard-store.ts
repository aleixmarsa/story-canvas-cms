import { create } from "zustand";
import { StoryWithVersions } from "@/types/story";
import { SectionWithVersions } from "@/types/section";
import { CurrentUser } from "@/types/auth";

interface DashboardState {
  stories: StoryWithVersions[];
  sections: SectionWithVersions[];
  users: CurrentUser[];
  selectedStory: StoryWithVersions | null;
  selectedSection: SectionWithVersions | null;
  currentUser: CurrentUser | null;

  // Setters
  setStories: (stories: StoryWithVersions[]) => void;
  setSections: (sections: SectionWithVersions[]) => void;
  setUsers: (users: CurrentUser[]) => void;

  // Selectors
  selectStory: (story: StoryWithVersions | null) => void;
  selectSection: (section: SectionWithVersions | null) => void;
  selectCurrentUser: (user: CurrentUser | null) => void;

  // Reset
  resetSelection: () => void;
  resetStoryAndSection: () => void;
  resetUsers: () => void;

  // CRUD Helpers
  addStory: (story: StoryWithVersions) => void;
  updateStory: (story: StoryWithVersions) => void;
  deleteStory: (storyId: number) => void;

  addSection: (section: SectionWithVersions) => void;
  updateSection: (section: SectionWithVersions) => void;
  deleteSection: (sectionId: number) => void;

  addUser: (user: CurrentUser) => void;
  updateUser: (user: CurrentUser) => void;
  deleteUser: (userId: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stories: [],
  sections: [],
  users: [],
  selectedStory: null,
  selectedSection: null,
  currentUser: null,

  // Setters
  setStories: (stories) => set({ stories }),
  setSections: (sections) => set({ sections }),
  setUsers: (users) => set({ users }),

  // Selectors
  selectStory: (story) =>
    set((state) => ({ ...state, selectedStory: story, selectedSection: null })),
  selectSection: (section) =>
    set((state) => ({ ...state, selectedSection: section })),
  selectCurrentUser: (user) => set({ currentUser: user }),

  // Reset
  resetSelection: () => set({ selectedStory: null, selectedSection: null }),
  resetStoryAndSection: () =>
    set({ selectedStory: null, selectedSection: null }),
  resetUsers: () => set({ users: [] }),

  // CRUD Stories
  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
  updateStory: (story) =>
    set((state) => ({
      stories: state.stories.map((s) => (s.id === story.id ? story : s)),
    })),
  deleteStory: (storyId) =>
    set((state) => ({
      stories: state.stories.filter((s) => s.id !== storyId),
    })),

  // CRUD Sections
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

  // CRUD Users
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),
}));

import { create } from "zustand";
import { CurrentUser } from "@/types/auth";

interface DashboardState {
  users: CurrentUser[];
  currentUser: CurrentUser | null;

  // Setters
  setUsers: (users: CurrentUser[]) => void;

  // Selectors
  selectCurrentUser: (user: CurrentUser | null) => void;

  // Reset
  resetUsers: () => void;

  addUser: (user: CurrentUser) => void;
  updateUser: (user: CurrentUser) => void;
  deleteUser: (userId: string) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  users: [],
  currentUser: null,

  // Setters
  setUsers: (users) => set({ users }),

  // Selectors
  selectCurrentUser: (user) => set({ currentUser: user }),

  // Reset
  resetUsers: () => set({ users: [] }),

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

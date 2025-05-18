export const ROUTES = {
  admin: "/admin",
  dashboard: "/admin/dashboard",
  stories: "/admin/dashboard/stories",
  newStory: "/admin/dashboard/stories/new",
  users: "/admin/dashboard/users",
  newUser: "/admin/dashboard/users/new",
  createInitalUser: "/admin/create-initial-user",
  login: "/admin/login",
  error: "/admin/error",
  swagger: "/docs/api-docs",
};

export const LIVE_PREVIEW_MESSAGES = {
  updateSingleSection: "preview:single_section_update",
  updateAllSections: "preview:sections_update",
  createSingleSection: "preview:single_section_create",
  deleteSection: "preview:delete_section",
} as const;

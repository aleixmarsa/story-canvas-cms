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
};

// sections/constants/font-size-map.ts
export const FONT_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;

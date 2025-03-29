export const sectionTypes = [
  "text",
  "image",
  "video",
  "parallax",
  "quote",
  "gallery",
] as const;

export type SectionType = (typeof sectionTypes)[number];

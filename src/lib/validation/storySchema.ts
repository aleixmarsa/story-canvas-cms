import { z } from "zod";
import { StoryVersion } from "@prisma/client";

// Types used in forms and validation for StoryVersion (not the main Story entity)
export type StoryInput = Pick<StoryVersion, "title" | "slug" | "createdBy">;

// Base schema for story version input
const baseStorySchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and use hyphens (e.g. my-story-title)"
    ),
  createdBy: z.string().min(1, "Author is required"),
});

// Extended schema for editable metadata
export const storySchema = baseStorySchema.extend({
  description: z.string().optional(),
  theme: z.any().optional(),
  components: z.any().optional(),
  content: z.any().optional(),
  storyId: z.number().optional(),
});

export type StoryFormData = z.infer<typeof storySchema>;

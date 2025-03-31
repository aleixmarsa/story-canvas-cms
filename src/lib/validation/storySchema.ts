import { z } from "zod";
import { Story } from "@prisma/client";

export type StoryInput = Pick<Story, "title" | "slug" | "author">;

export const storySchema: z.ZodType<StoryInput> = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and use hyphens (e.g. my-story-title)"
    ),
  author: z.string(),
});

export type StoryFormData = z.infer<typeof storySchema>;

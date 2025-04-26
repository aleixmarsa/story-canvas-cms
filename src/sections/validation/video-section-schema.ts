import { z } from "zod";
import { baseFields } from "@/lib/validation/section-base-fields-schema";

export const videoSectionSchema = baseFields.extend({
  embedUrl: z.string().url("Invalid video URL"),
  title: z.string().min(1, "Title is required"),
});

export type VideoSectionSchema = typeof videoSectionSchema;

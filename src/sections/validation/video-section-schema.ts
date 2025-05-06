import { z } from "zod";
import { baseFields } from "@/sections/validation/section-base-fields-schema";
import { mediaFieldSchema } from "./media-field-schema";

export const videoSectionSchema = baseFields.extend({
  video: mediaFieldSchema,
  title: z.string().min(1, "Title is required"),
});

export type VideoSectionSchema = typeof videoSectionSchema;
export type VideoSectionProps = z.infer<typeof videoSectionSchema>;

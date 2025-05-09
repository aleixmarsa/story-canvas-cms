import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { mediaFieldSchema } from "../fields/media-field-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";

export const videoSectionSchema = baseFields.extend({
  // DATA
  video: mediaFieldSchema,
  title: z.string().min(1, "Title is required"),
  // STYLE
  ...stylesFields,
  // ANIMATION
  ...animationFields,
});

export type VideoSectionSchema = typeof videoSectionSchema;
export type VideoSectionProps = z.infer<typeof videoSectionSchema>;

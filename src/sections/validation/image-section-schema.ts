import { z } from "zod";
import { baseFields } from "@/sections/validation/section-base-fields-schema";
import { mediaFieldSchema } from "./media-field-schema";

export const imageSectionSchema = baseFields.extend({
  image: mediaFieldSchema,
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export type ImageSectionSchema = typeof imageSectionSchema;
export type ImageSectionProps = z.infer<typeof imageSectionSchema>;

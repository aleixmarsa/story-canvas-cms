import { z } from "zod";
import { baseFields } from "@/lib/validation/section-base-fields-schema";

export const imageSectionSchema = baseFields.extend({
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export type ImageSectionSchema = typeof imageSectionSchema;

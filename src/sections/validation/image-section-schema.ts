import { z } from "zod";
import { baseFields } from "@/lib/validation/section-base-fields-schema";

export const imageSectionSchema = baseFields.extend({
  image: z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string(),
  }),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export type ImageSectionSchema = typeof imageSectionSchema;
export type ImageSectionProps = z.infer<typeof imageSectionSchema>;

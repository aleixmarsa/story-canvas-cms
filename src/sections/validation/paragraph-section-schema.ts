import { z } from "zod";
import { baseFields } from "@/sections/validation/section-base-fields-schema";

export const paragraphSectionSchema = baseFields.extend({
  body: z.string().min(1, "Text cannot be empty"),
});

export type ParagraphSectionSchema = typeof paragraphSectionSchema;
export type ParagraphSectionProps = z.infer<typeof paragraphSectionSchema>;

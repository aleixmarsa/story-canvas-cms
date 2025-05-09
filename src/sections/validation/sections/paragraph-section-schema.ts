import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";

export const paragraphSectionSchema = baseFields.extend({
  // DATA
  body: z.string().min(1, "Text cannot be empty"),
  // STYLE
  ...stylesFields,
  // ANIMATION
  ...animationFields,
});

export type ParagraphSectionSchema = typeof paragraphSectionSchema;
export type ParagraphSectionProps = z.infer<typeof paragraphSectionSchema>;

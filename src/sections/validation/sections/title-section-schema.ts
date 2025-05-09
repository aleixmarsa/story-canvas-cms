import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";

export const titleSectionSchema = baseFields.extend({
  // DATA
  text: z.string().min(1, "Title is required"),
  // STYLE
  ...stylesFields,
  // ANIMATION
  ...animationFields,
});

export type TitleSectionSchema = typeof titleSectionSchema;

export type TitleSectionProps = z.infer<typeof titleSectionSchema>;

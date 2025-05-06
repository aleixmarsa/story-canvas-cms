import { z } from "zod";
import { baseFields } from "@/sections/validation/base-fields-schema";

export const titleSectionSchema = baseFields.extend({
  text: z.string().min(1, "Title cannot be empty"),
  backgroundImage: z.string().optional(),
});

export type TitleSectionSchema = typeof titleSectionSchema;

export type TitleSectionProps = z.infer<typeof titleSectionSchema>;

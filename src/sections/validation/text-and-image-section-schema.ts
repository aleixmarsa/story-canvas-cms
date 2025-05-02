import { z } from "zod";
import { baseFields } from "@/lib/validation/section-base-fields-schema";

export const textAndimageSectionSchema = baseFields.extend({
  body: z.string().min(1, "Text cannot be empty"),
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  caption: z.string().optional(),
  layout: z.enum(["left", "right"], {
    errorMap: () => ({ message: "You need to select a layout." }),
  }),
});

export type TextAndImageSectionSchema = typeof textAndimageSectionSchema;
export type TextAndImageSectionProps = z.infer<
  typeof textAndimageSectionSchema
>;

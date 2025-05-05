import { z } from "zod";
import { baseFields } from "@/lib/validation/section-base-fields-schema";

export const paragraphAndimageSectionSchema = baseFields.extend({
  body: z.string().min(1, "Text cannot be empty"),
  image: z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string(),
  }),
  alt: z.string().optional(),
  caption: z.string().optional(),
  layout: z.enum(["left", "right"], {
    errorMap: () => ({ message: "You need to select a layout." }),
  }),
});

export type ParagraphAndImageSectionSchema =
  typeof paragraphAndimageSectionSchema;
export type ParagraphAndImageSectionProps = z.infer<
  typeof paragraphAndimageSectionSchema
>;

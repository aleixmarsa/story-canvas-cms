import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { createAnimationSchema } from "../animations/create-animation-schema";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";
import { stylesFieldsSchema } from "../fields/base-styles-schema";

export const paragraphSectionSchema = baseFields.extend({
  // DATA
  body: z.string().min(1, "Text cannot be empty"),
  // STYLE
  ...stylesFieldsSchema,
  textPadding: z
    .object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    })
    .optional(),
  // ANIMATION
  textAnimation: createAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type ParagraphSectionSchema = typeof paragraphSectionSchema;
export type ParagraphSectionProps = z.infer<typeof paragraphSectionSchema>;

import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { stylesFieldsSchema } from "../fields/styles-fields-schema";
import { numberOrUndefined } from "../helpers";
import { createTextAnimationSchema } from "../animations/create-animation-schema";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";

export const titleSectionSchema = baseFields.extend({
  // DATA
  text: z.string().min(1, "Title is required"),
  // STYLE
  ...stylesFieldsSchema,
  textPadding: z
    .object({
      top: numberOrUndefined.optional(),
      bottom: numberOrUndefined.optional(),
      left: numberOrUndefined.optional(),
      right: numberOrUndefined.optional(),
    })
    .optional(),
  // ANIMATION
  textAnimation: createTextAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type TitleSectionSchema = typeof titleSectionSchema;

export type TitleSectionProps = z.infer<typeof titleSectionSchema>;

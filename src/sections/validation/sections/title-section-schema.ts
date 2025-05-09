import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";
import { numberOrUndefined } from "../helpers";

export const titleSectionSchema = baseFields.extend({
  // DATA
  text: z.string().min(1, "Title is required"),
  // STYLE
  ...stylesFields,
  textPadding: z
    .object({
      top: numberOrUndefined.optional(),
      bottom: numberOrUndefined.optional(),
      left: numberOrUndefined.optional(),
      right: numberOrUndefined.optional(),
    })
    .optional(),
  // ANIMATION
  ...animationFields,
});

export type TitleSectionSchema = typeof titleSectionSchema;

export type TitleSectionProps = z.infer<typeof titleSectionSchema>;

import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { stylesFields } from "../fields/styles-fields-schema";
import { ANIMATION_TYPES, EASE_TYPES } from "../fields/animation-field-schema";

export const paragraphSectionSchema = baseFields.extend({
  // DATA
  body: z.string().min(1, "Text cannot be empty"),
  // STYLE
  ...stylesFields,
  textPadding: z
    .object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    })
    .optional(),
  // ANIMATION
  animationType: z.enum(ANIMATION_TYPES).default("none"),
  delay: z.number().min(0).max(10).optional(),
  duration: z.number().min(0).max(10).optional(),
  easing: z.enum(EASE_TYPES).optional(),

  scrollTrigger: z
    .object({
      start: z.string().min(1, "Start is required").optional(),
      end: z.string().min(1, "End is required").optional(),
      scrub: z.enum(["true", "false"]).optional(),
      pin: z.enum(["true", "false"]).optional(),
    })
    .superRefine(({ start, end }, ctx) => {
      if ((start && !end) || (end && !start)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "ScrollTrigger settings are required when using ScrollTrigger",
        });
      }
    }),
});

export type ParagraphSectionSchema = typeof paragraphSectionSchema;
export type ParagraphSectionProps = z.infer<typeof paragraphSectionSchema>;

import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { stylesFieldsSchema } from "../fields/base-styles-schema";
import { numberOrUndefined } from "../helpers";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";
import { createAnimationSchema } from "../animations/create-animation-schema";

export const videoSectionSchema = baseFields.extend({
  // DATA
  video: z.string().url("Invalid video URL").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  // STYLE
  ...stylesFieldsSchema,
  videoSize: z
    .object({
      width: numberOrUndefined.optional(),
      height: numberOrUndefined.optional(),
    })
    .optional(),
  // ANIMATION
  textAnimation: createAnimationSchema(),
  videoAnimation: createAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type VideoSectionSchema = typeof videoSectionSchema;
export type VideoSectionProps = z.infer<typeof videoSectionSchema>;

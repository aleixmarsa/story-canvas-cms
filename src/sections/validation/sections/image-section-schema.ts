import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { mediaFieldSchema } from "../fields/media-field-schema";
import { stylesFieldsSchema } from "../fields/base-styles-schema";
import { numberOrUndefined } from "../helpers";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";
import { createTextAnimationSchema } from "../animations/create-animation-schema";

export const imageSectionSchema = baseFields.extend({
  // DATA
  image: mediaFieldSchema,
  alt: z.string().optional(),
  caption: z.string().optional(),
  // STYLE
  ...stylesFieldsSchema,
  imageSize: z
    .object({
      width: numberOrUndefined.optional(),
      height: numberOrUndefined.optional(),
    })
    .optional(),

  // ANIMATION
  imageAnimation: createTextAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type ImageSectionSchema = typeof imageSectionSchema;
export type ImageSectionProps = z.infer<typeof imageSectionSchema>;

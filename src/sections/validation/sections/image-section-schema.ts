import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { mediaFieldSchema } from "../fields/media-field-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";
import { numberOrUndefined } from "../helpers";

export const imageSectionSchema = baseFields.extend({
  // DATA
  image: mediaFieldSchema,
  alt: z.string().optional(),
  caption: z.string().optional(),
  // STYLE
  ...stylesFields,
  imageSize: z
    .object({
      width: numberOrUndefined.optional(),
      height: numberOrUndefined.optional(),
    })
    .optional(),

  // ANIMATION
  ...animationFields,
});

export type ImageSectionSchema = typeof imageSectionSchema;
export type ImageSectionProps = z.infer<typeof imageSectionSchema>;

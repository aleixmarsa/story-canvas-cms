import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { mediaFieldSchema } from "../fields/media-field-schema";
import { stylesFieldsSchema } from "../fields/base-styles-schema";
import { numberOrUndefined } from "../helpers";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";
import { createAnimationSchema } from "../animations/create-animation-schema";

export const paragraphAndimageSectionSchema = baseFields.extend({
  //DATA
  body: z.string().min(1, "Text cannot be empty"),
  image: mediaFieldSchema,
  alt: z.string().optional(),
  caption: z.string().optional(),
  layout: z.enum(["left", "right"], {
    errorMap: () => ({ message: "You need to select a layout." }),
  }),
  // STYLE
  ...stylesFieldsSchema,
  imageSize: z
    .object({
      width: numberOrUndefined.optional(),
      height: numberOrUndefined.optional(),
    })
    .optional(),

  // ANIMATION
  textAnimation: createAnimationSchema(),
  imageAnimation: createAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type ParagraphAndImageSectionSchema =
  typeof paragraphAndimageSectionSchema;
export type ParagraphAndImageSectionProps = z.infer<
  typeof paragraphAndimageSectionSchema
>;

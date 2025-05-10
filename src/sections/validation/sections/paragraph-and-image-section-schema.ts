import { z } from "zod";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";
import { mediaFieldSchema } from "../fields/media-field-schema";
import { animationFields } from "../fields/animation-field-schema";
import { stylesFields } from "../fields/styles-fields-schema";
import { numberOrUndefined } from "../helpers";

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

export type ParagraphAndImageSectionSchema =
  typeof paragraphAndimageSectionSchema;
export type ParagraphAndImageSectionProps = z.infer<
  typeof paragraphAndimageSectionSchema
>;

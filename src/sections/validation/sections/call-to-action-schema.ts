import { z } from "zod";
import { baseFields } from "../fields/base-fields-schema";
import { stylesFieldsSchema } from "../fields/base-styles-schema";
import { createAnimationSchema } from "../animations/create-animation-schema";
import { createScrollTriggerSchema } from "../animations/create-scroll-trigger-schema";

export const callToActionSectionSchema = baseFields.extend({
  label: z.string().min(1, "Button text is required"),
  url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  newTab: z.boolean().default(true),
  // STYLE
  ...stylesFieldsSchema,
  button: z.object({
    buttonColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      message: "Invalid hex color code",
    }),
    buttonBorderRadius: z
      .number()
      .min(0, "Border radius must be a positive number")
      .optional(),
    labelColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      message: "Invalid hex color code",
    }),
    labelSize: z
      .number()
      .min(0, "Font size must be a positive number")
      .optional(),
  }),
  buttonPadding: z.object({
    top: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
    right: z.number().optional(),
  }),
  // ANIMATION
  buttonAnimation: createAnimationSchema(),
  scrollTrigger: createScrollTriggerSchema(),
});

export type CallToActionSectionSchema = typeof callToActionSectionSchema;
export type CallToActionSectionProps = z.infer<
  typeof callToActionSectionSchema
>;

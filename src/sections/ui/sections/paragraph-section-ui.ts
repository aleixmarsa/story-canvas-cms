import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { paragraphSectionSchema } from "../../validation/sections/paragraph-section-schema";
import { textPadding } from "../styles/text-padding-ui";

export const paragraphSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphSectionSchema
> = {
  schema: paragraphSectionSchema,
  ui: {
    data: {
      ...baseUIData,
      body: {
        label: "Body",
        type: "richtext",
        required: true,
        placeholder: "Write your paragraph...",
      },
    },
    style: {
      ...baseUIStyles,
      ...textPadding,
    },
    animation: {
      ...baseUIAnimation,
    },
  },
};

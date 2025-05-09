import { paragraphAndimageSectionSchema } from "../../validation/sections/paragraph-and-image-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const paragraphAndImageSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphAndimageSectionSchema
> = {
  schema: paragraphAndimageSectionSchema,
  ui: {
    data: {
      ...baseUIData,
      layout: {
        label: "Paragraph position",
        type: "radio",
        required: true,
        options: [
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ],
      },
      image: {
        label: "Image",
        type: "image",
        required: true,
      },
      alt: {
        label: "Alt text",
        type: "richtext",
      },
      caption: {
        label: "Caption",
        type: "richtext",
      },
      body: {
        label: "Body",
        type: "richtext",
        required: true,
        placeholder: "Write your paragraph...",
      },
    },
    style: {
      ...baseUIStyles,
    },
    animation: {
      ...baseUIAnimation,
    },
  },
};

import { imageSectionSchema } from "../../validation/sections/image-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const imageSectionSchemaWithUI: SchemaWithUI<typeof imageSectionSchema> =
  {
    schema: imageSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        image: {
          label: "Image",
          type: "image",
          required: true,
        },
        alt: {
          label: "Alt text",
          type: "text",
          required: true,
        },
        caption: {
          label: "Caption",
          type: "richtext",
        },
      },
      style: {
        ...baseUIStyles,
        imageSize: {
          label: "Image Size",
          type: "composite",
          fields: {
            width: {
              label: "Width",
              type: "number",
              default: 0,
              placeholder: "In pixels",
            },
            height: {
              label: "Height",
              type: "number",
              default: 0,
              placeholder: "In pixels",
            },
          },
        },
      },
      animation: {
        ...baseUIAnimation,
      },
    },
  };

import { imageSectionSchema } from "../../validation/sections/image-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../fields/styles-fields-ui";
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
          type: "richtext",
        },
        caption: {
          label: "Caption",
          type: "richtext",
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

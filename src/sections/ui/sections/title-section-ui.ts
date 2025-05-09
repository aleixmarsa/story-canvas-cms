import { titleSectionSchema } from "../../validation/sections/title-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../fields/styles-fields-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const titleSectionSchemaWithUI: SchemaWithUI<typeof titleSectionSchema> =
  {
    schema: titleSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        text: {
          label: "Title",
          type: "text",
          required: true,
          placeholder: "Enter your title...",
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

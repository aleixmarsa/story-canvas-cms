import { titleSectionSchema } from "../../validation/sections/title-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { elementPadding } from "../styles/text-padding-ui";

export const titleSectionSchemaWithUI: SchemaWithUI<typeof titleSectionSchema> =
  {
    schema: titleSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        text: {
          label: "Title",
          type: "richtext",
          required: true,
          placeholder: "Enter your title...",
        },
      },
      style: {
        ...baseUIStyles,
        ...elementPadding("textPadding", "Text Padding"),
      },
      animation: {
        ...baseUIAnimation,
      },
    },
  };

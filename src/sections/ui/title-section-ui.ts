import { titleSectionSchema } from "../validation/title-section-schema";
import { baseUI } from "@/sections/ui/base-fields-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const titleSectionSchemaWithUI: SchemaWithUI<typeof titleSectionSchema> =
  {
    schema: titleSectionSchema,
    ui: {
      ...baseUI,
      text: {
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Enter your title...",
      },
      backgroundImage: {
        label: "Background Image URL",
        type: "url",
        placeholder: "Enter a URL for the background image...",
      },
    },
  };

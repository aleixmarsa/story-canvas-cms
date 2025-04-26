import { imageSectionSchema } from "../validation/image-section-schema";
import { baseUI } from "@/sections/ui/base-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const imageSectionSchemaWithUI: SchemaWithUI<typeof imageSectionSchema> =
  {
    schema: imageSectionSchema,
    ui: {
      ...baseUI,
      url: {
        label: "Image URL",
        type: "url",
        required: true,
      },
      alt: {
        label: "Alt text",
        type: "text",
      },
      caption: {
        label: "Caption",
        type: "text",
      },
    },
  };

import { textAndimageSectionSchema } from "../validation/text-and-image-section-schema";
import { baseUI } from "@/sections/ui/base-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const textAndImageSectionSchemaWithUI: SchemaWithUI<
  typeof textAndimageSectionSchema
> = {
  schema: textAndimageSectionSchema,
  ui: {
    ...baseUI,
    layout: {
      label: "Text position",
      type: "radio",
      required: true,
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
    },
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
    body: {
      label: "Body",
      type: "richtext",
      required: true,
      placeholder: "Write your paragraph...",
    },
  },
};

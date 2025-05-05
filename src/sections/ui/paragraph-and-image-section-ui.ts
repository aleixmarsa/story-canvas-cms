import { paragraphAndimageSectionSchema } from "../validation/paragraph-and-image-section-schema";
import { baseUI } from "@/sections/ui/base-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const paragraphAndImageSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphAndimageSectionSchema
> = {
  schema: paragraphAndimageSectionSchema,
  ui: {
    ...baseUI,
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

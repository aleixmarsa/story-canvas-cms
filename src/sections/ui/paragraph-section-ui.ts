import { baseUI } from "@/sections/ui/base-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { paragraphSectionSchema } from "../validation/paragraph-section-schema";

export const paragraphSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphSectionSchema
> = {
  schema: paragraphSectionSchema,
  ui: {
    ...baseUI,
    body: {
      label: "Body",
      type: "richtext",
      required: true,
      placeholder: "Write your paragraph...",
    },
  },
};

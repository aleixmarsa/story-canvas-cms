import type { FieldMeta } from "@/types/section-fields";
import type { StylesFields } from "@/sections/validation/fields/styles-fields-schema";

export const baseUIStyles: Record<keyof StylesFields, FieldMeta> = {
  backgroundImage: {
    label: "Background Image URL",
    type: "url",
    placeholder: "Enter a background image URL...",
  },
  backgroundColor: {
    label: "Background Color",
    type: "text",
    placeholder: "Enter a hex color code...",
    default: "#ffffff",
  },
};

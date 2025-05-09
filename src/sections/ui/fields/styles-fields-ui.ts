import type { FieldMeta } from "@/types/section-fields";
import type { StylesFields } from "@/sections/validation/fields/styles-fields-schema";

export const baseUIStyles: Record<keyof StylesFields, FieldMeta> = {
  backgroundImage: {
    label: "Background Image URL",
    type: "url",
    placeholder: "Enter a background image URL...",
  },
  fontColor: {
    label: "Font Color",
    type: "text",
    placeholder: "Enter a hex color code...",
    default: "#000000",
  },
  fontSize: {
    label: "Font Size",
    type: "select",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
    default: "medium",
  },
};

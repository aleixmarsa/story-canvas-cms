import type { FieldMeta } from "@/types/section-fields";

export const textPadding: Record<string, FieldMeta> = {
  textPadding: {
    label: "Text Padding",
    type: "composite",
    subtype: "number",
    fields: {
      top: {
        label: "Top",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      bottom: {
        label: "Bottom",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      left: {
        label: "Left",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      right: {
        label: "Right",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
    },
  },
};

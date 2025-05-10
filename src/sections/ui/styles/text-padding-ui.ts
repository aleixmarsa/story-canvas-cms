import type { FieldMeta } from "@/types/section-fields";

export const elementPadding = <T extends string>(
  key: T,
  label: string
): Record<T, FieldMeta> => {
  const fieldMeta: FieldMeta = {
    label,
    type: "composite",
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
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};

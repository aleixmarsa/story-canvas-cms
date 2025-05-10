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
        label: "Top (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      bottom: {
        label: "Bottom (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      left: {
        label: "Left (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
      right: {
        label: "Right (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
      },
    },
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};

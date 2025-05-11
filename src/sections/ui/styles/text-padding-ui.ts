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
        tip: "Inner space above the element.",
      },
      bottom: {
        label: "Bottom (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space below the element.",
      },
      left: {
        label: "Left (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space to the left of the element.",
      },
      right: {
        label: "Right (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space to the right of the element.",
      },
    },
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};

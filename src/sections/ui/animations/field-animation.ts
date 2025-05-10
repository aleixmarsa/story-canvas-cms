import type { FieldMeta } from "@/types/section-fields";
import {
  ANIMATION_TYPES,
  EASE_TYPES,
} from "@/sections/validation/fields/animation-field-schema";

export const fieldAnimation = <T extends string>(
  key: T,
  label: string
): Record<T, FieldMeta> => {
  const fieldMeta: FieldMeta = {
    label,
    type: "composite",
    fields: {
      animationType: {
        label: "Type",
        type: "select",
        options: Object.values(ANIMATION_TYPES).map((t) => ({
          value: t,
          label: t,
        })),
        default: "none",
      },
      delay: {
        label: "Delay (s)",
        type: "number",
        placeholder: "Seconds",
      },
      duration: {
        label: "Duration (s)",
        type: "number",
        placeholder: "Seconds",
      },
      easing: {
        label: "Easing",
        type: "select",
        options: EASE_TYPES.map((e) => ({ value: e, label: e })),
        default: "none",
      },
    },
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};

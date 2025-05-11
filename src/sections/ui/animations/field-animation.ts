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
        tip: "Select how the element animates in (e.g. fade, slide).",
        options: Object.values(ANIMATION_TYPES).map((t) => ({
          value: t,
          label: t,
        })),
        default: "none",
      },
      delay: {
        label: "Delay",
        type: "number",
        placeholder: "Seconds",
        tip: "Time to wait before the animation starts, in seconds.",
      },
      duration: {
        label: "Duration",
        type: "number",
        placeholder: "Seconds",
        default: 0,
        tip: "How long the animation runs, in seconds.",
      },
      easing: {
        label: "Easing",
        type: "select",
        tip: "Controls the speed curve of the animation.",
        options: EASE_TYPES.map((e) => ({ value: e, label: e })),
        default: "none",
      },
    },
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};

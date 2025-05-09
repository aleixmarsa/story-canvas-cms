import type { FieldMeta } from "@/types/section-fields";
import type { AnimationFields } from "@/sections/validation/fields/animation-field-schema";
import {
  ANIMATION_TYPES,
  EASE_TYPES,
} from "@/sections/validation/fields/animation-field-schema";

export const baseUIAnimation: Record<keyof AnimationFields, FieldMeta> = {
  animationType: {
    label: "Type",
    type: "select",
    options: ANIMATION_TYPES.map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    })),
  },
  delay: {
    label: "Delay",
    type: "number",
    placeholder: "Seconds",
  },
  duration: {
    label: "Duration",
    type: "number",
    placeholder: "Seconds",
  },
  easing: {
    label: "Easing",
    type: "select",
    options: EASE_TYPES.map((e) => ({ value: e, label: e })),
  },
};

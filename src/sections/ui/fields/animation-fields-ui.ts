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
  // withScrollTrigger: {
  //   label: "Use ScrollTrigger",
  //   type: "radio",
  //   options: [
  //     { label: "Yes", value: "true" },
  //     { label: "No", value: "false" },
  //   ],
  //   default: "false",
  // },
  // scrollTrigger: {
  //   label: "ScrollTrigger Settings",
  //   type: "composite",
  //   fields: {
  //     start: {
  //       label: "Start",
  //       type: "text",
  //       placeholder: "e.g. top bottom",
  //       required: true,
  //     },
  //     end: {
  //       label: "End",
  //       type: "text",
  //       placeholder: "e.g. bottom top",
  //       required: true,
  //     },
  //     scrub: {
  //       label: "Scrub",
  //       type: "radio",
  //       options: [
  //         { label: "Yes", value: "true" },
  //         { label: "No", value: "false" },
  //       ],
  //       default: "false",
  //     },
  //     pin: {
  //       label: "Pin",
  //       type: "radio",
  //       options: [
  //         { label: "Yes", value: "true" },
  //         { label: "No", value: "false" },
  //       ],
  //       default: "false",
  //     },
  //   },
  // },
};

import type { FieldMeta } from "@/types/section-fields";
import type { BaseFields } from "@/sections/validation/base-fields-schema";
import {
  ANIMATION_TYPES,
  EASE_TYPES,
} from "../validation/animation-field-schema";

export const baseUI: Record<keyof BaseFields, FieldMeta> = {
  name: {
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Name of the section",
  },
  createdBy: {
    label: "Created by",
    type: "text",
    required: true,
    placeholder: "Author of this section",
  },
  animation: {
    label: "Animation",
    type: "composite",
    subtype: "animation",
    required: false,
    fields: {
      type: {
        label: "Type",
        type: "select",
        required: false,
        options: ANIMATION_TYPES.map((type) => ({
          value: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        })),
      },
      delay: {
        label: "Delay",
        type: "number",
        default: 0,
        required: false,
        placeholder: "In seconds",
      },
      duration: {
        label: "Duration",
        type: "number",
        default: 0.1,
        required: false,
        placeholder: "In seconds",
      },
      easing: {
        label: "Easing",
        type: "select",
        required: false,
        options: EASE_TYPES.map((type) => ({
          value: type,
          label: type,
        })),
      },
    },
  },
};

import type { FieldMeta } from "@/types/section-fields";
import type { BaseFields } from "@/sections/validation/base-fields-schema";

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
        type: "radio",
        required: false,
        options: [
          { label: "None", value: "none" },
          { label: "Fade", value: "fade" },
          { label: "Slide up", value: "slide-up" },
          { label: "Zoom in", value: "zoom-in" },
        ],
      },
      delay: {
        label: "Delay",
        type: "number",
        required: false,
        placeholder: "Delay in seconds",
      },
      duration: {
        label: "Duration",
        type: "number",
        required: false,
        placeholder: "Duration in seconds",
      },
      easing: {
        label: "Easing",
        type: "text",
        required: false,
        placeholder: "e.g., easeOut",
      },
    },
  },
};

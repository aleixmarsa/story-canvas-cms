import type { FieldMeta } from "@/types/section-fields";
import type { StylesFields } from "@/sections/validation/fields/styles-fields-schema";
import {
  BACKGROUND_SIZE_VALUES,
  BACKGROUND_POSITION_VALUES,
} from "@/sections/validation/fields/styles-fields-schema";

export const baseUIStyles: Record<keyof StylesFields, FieldMeta> = {
  sectionBackground: {
    label: "Section Background",
    type: "composite",
    fields: {
      image: {
        label: "Image URL",
        type: "url",
        placeholder: "Image URL...",
      },
      color: {
        label: "Color",
        type: "color",
        default: "#ffffff",
      },
      size: {
        label: "Size",
        type: "select",
        options: BACKGROUND_SIZE_VALUES.map((v) => ({ value: v, label: v })),
        default: "cover",
      },
      position: {
        label: "Position",
        type: "select",
        options: BACKGROUND_POSITION_VALUES.map((v) => ({
          value: v,
          label: v,
        })),
        default: "center",
      },
    },
  },
  sectionPadding: {
    label: "Section Padding",
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
  },
  sectionMargin: {
    label: "Section Margin",
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
  },
};

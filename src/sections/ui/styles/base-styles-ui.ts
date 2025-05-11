import type { FieldMeta } from "@/types/section-fields";
import type { StylesFields } from "@/sections/validation/fields/base-styles-schema";
import {
  BACKGROUND_SIZE_VALUES,
  BACKGROUND_POSITION_VALUES,
  SECTION_HEIGHT,
  JUSTIFY_CONTENT,
  ALIGN_ITEMS,
} from "@/sections/validation/fields/base-styles-schema";

export const baseUIStyles: Record<keyof StylesFields, FieldMeta> = {
  sectionLayout: {
    label: "Section Layout",
    type: "composite",
    fields: {
      height: {
        label: "Height",
        type: "select",
        options: Object.entries(SECTION_HEIGHT).map(([key, value]) => ({
          value: value,
          label: key,
        })),
        default: "content",
      },

      justifyContent: {
        label: "Horizontal Align",
        type: "select",
        options: Object.entries(JUSTIFY_CONTENT).map(([key, value]) => ({
          value: value,
          label: key,
        })),
        default: "center",
      },
      alignItems: {
        label: "Vertical Align",
        type: "select",
        options: Object.entries(ALIGN_ITEMS).map(([key, value]) => ({
          value: value,
          label: key,
        })),
        default: "center",
      },
    },
  },
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

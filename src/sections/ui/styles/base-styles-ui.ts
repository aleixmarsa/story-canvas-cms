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
        default: "auto",
        tip: "Sets the section height (e.g. full screen or auto).",
      },

      justifyContent: {
        label: "Horizontal Align",
        type: "select",
        options: Object.entries(JUSTIFY_CONTENT).map(([key, value]) => ({
          value: value,
          label: key,
        })),
        default: "flex-start",
        tip: "Aligns content horizontally within the section.",
      },
      alignItems: {
        label: "Vertical Align",
        type: "select",
        options: Object.entries(ALIGN_ITEMS).map(([key, value]) => ({
          value: value,
          label: key,
        })),
        default: "flex-start",
        tip: "Aligns content vertically within the section.",
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
        tip: "Optional background image for the section.",
      },
      color: {
        label: "Color",
        type: "color",
        default: "#ffffff",
        tip: "Background color of the section.",
      },
      size: {
        label: "Size",
        type: "select",
        options: BACKGROUND_SIZE_VALUES.map((v) => ({ value: v, label: v })),
        default: "cover",
        tip: "How the background image is scaled (e.g. cover or contain).",
      },
      position: {
        label: "Position",
        type: "select",
        options: BACKGROUND_POSITION_VALUES.map((v) => ({
          value: v,
          label: v,
        })),
        default: "center",
        tip: "Position of the background image.",
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
        tip: "Inner space above the content.",
      },
      bottom: {
        label: "Bottom (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space below the content.",
      },
      left: {
        label: "Left (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space to the left of the content.",
      },
      right: {
        label: "Right (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Inner space to the right of the content.",
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
        tip: "Space outside the top of the section.",
      },
      bottom: {
        label: "Bottom (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Space outside the bottom of the section.",
      },
      left: {
        label: "Left (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Space outside the left of the section.",
      },
      right: {
        label: "Right (px)",
        type: "number",
        default: 0,
        placeholder: "In pixels",
        tip: "Space outside the right of the section.",
      },
    },
  },
};

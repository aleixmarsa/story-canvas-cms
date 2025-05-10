import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { paragraphSectionSchema } from "../../validation/sections/paragraph-section-schema";
import { elementPadding } from "../styles/text-padding-ui";
import {
  ANIMATION_TYPES,
  EASE_TYPES,
} from "@/sections/validation/fields/animation-field-schema";

export const paragraphSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphSectionSchema
> = {
  schema: paragraphSectionSchema,
  ui: {
    data: {
      ...baseUIData,
      body: {
        label: "Body",
        type: "richtext",
        required: true,
        placeholder: "Write your paragraph...",
      },
    },
    style: {
      ...baseUIStyles,
      ...elementPadding("textPadding", "Text Padding"),
    },
    animation: {
      animationType: {
        label: "Type",
        type: "select",
        options: ANIMATION_TYPES.map((t) => ({ value: t, label: t })),
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
      scrollTrigger: {
        label: "ScrollTrigger Settings",
        type: "composite",
        fields: {
          start: {
            label: "Start",
            type: "select",
            options: [
              { label: "none", value: "none" },
              { label: "top bottom", value: "top bottom" },
              { label: "bottom bottom", value: "bottom bottom" },
              { label: "50% bottom", value: "50% bottom" },
            ],
            default: "none",
          },
          end: {
            label: "End",
            type: "select",
            options: [
              { label: "none", value: "none" },
              { label: "top top", value: "top top" },
              { label: "top 50%", value: "top 50%" },
              { label: "50% 50%", value: "50% 50%" },
            ],
            default: "none",
          },
          scrub: {
            label: "Scrub",
            type: "radio",
            options: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
            default: "false",
          },
          pin: {
            label: "Pin",
            type: "radio",
            options: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
            default: "false",
          },
        },
      },
    },
  },
};

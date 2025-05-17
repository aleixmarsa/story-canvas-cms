import type { SchemaWithUI } from "@/types/section-fields";
import { callToActionSectionSchema } from "@/sections/validation/sections/call-to-action-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import { fieldAnimation } from "../animations/field-animation";
import { fieldScrolltrigger } from "../animations/element-scrolltrigger";
import { elementPadding } from "../styles/text-padding-ui";

export const callToActionSectionSchemaWithUI: SchemaWithUI<
  typeof callToActionSectionSchema
> = {
  schema: callToActionSectionSchema,
  ui: {
    data: {
      ...baseUIData,
      label: {
        label: "Button Label",
        type: "text",
        required: true,
        placeholder: "e.g. Visit website",
      },
      url: {
        label: "URL",
        type: "url",
        required: true,
        placeholder: "https://example.com",
      },
      newTab: {
        label: "Open in New Tab?",
        type: "radio",
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        default: "true",
      },
    },
    style: {
      ...baseUIStyles,
      button: {
        label: "Button",
        type: "composite",
        fields: {
          buttonColor: {
            label: "Button Color",
            type: "color",
            default: "#000000",
            tip: "Button background color",
          },
          buttonBorderRadius: {
            label: "Border Radius",
            type: "number",
            default: 0,
            placeholder: "In pixels",
            tip: "Set the button border radius. Leave empty for square corners.",
          },
          labelColor: {
            label: "Label Color",
            type: "color",
            default: "#ffffff",
            tip: "Button label color",
          },
          labelSize: {
            label: "Label Size",
            type: "number",
            default: 16,
            placeholder: "In pixels",
            tip: "Set the button label font size.",
          },
        },
      },
      ...elementPadding("buttonPadding", "Button Padding"),
    },
    animation: {
      ...fieldAnimation("buttonAnimation", "Button Animation"),
      ...fieldScrolltrigger("scrollTrigger", "Button ScrollTrigger"),
    },
  },
};

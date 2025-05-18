import { paragraphAndimageSectionSchema } from "../../validation/sections/paragraph-and-image-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { fieldAnimation } from "../animations/field-animation";
import { fieldScrolltrigger } from "../animations/element-scrolltrigger";

export const paragraphAndImageSectionSchemaWithUI: SchemaWithUI<
  typeof paragraphAndimageSectionSchema
> = {
  schema: paragraphAndimageSectionSchema,
  ui: {
    data: {
      ...baseUIData,
      image: {
        label: "Image",
        type: "image",
        required: true,
      },
      alt: {
        label: "Alt text",
        type: "text",
        required: true,
      },
      caption: {
        label: "Caption",
        type: "richtext",
      },
      body: {
        label: "Body",
        type: "richtext",
        required: true,
        placeholder: "Write your paragraph...",
      },
    },
    style: {
      ...baseUIStyles,
      contentLayout: {
        label: "Content Layout",
        type: "composite",
        fields: {
          direction: {
            label: "Direction",
            type: "select",
            default: "row",
            options: [
              { value: "row", label: "Row (side by side)" },
              { value: "column", label: "Column (stacked)" },
            ],
            tip: "Sets the direction of the content within the section.",
          },
          order: {
            label: "Order",
            type: "select",
            default: "image",
            options: [
              { value: "image", label: "Image first" },
              { value: "text", label: "Text first" },
            ],
            tip: "Sets the order of the content within the section.",
          },
          justifyContent: {
            label: "Horizontal Align",
            type: "select",
            options: [
              { value: "justify-start", label: "Start" },
              { value: "justify-center", label: "Center" },
              { value: "justify-end", label: "End" },
              { value: "justify-between", label: "Space Between" },
              { value: "justify-around", label: "Space Around" },
              { value: "justify-evenly", label: "Space Evenly" },
            ],
            default: "justify-between",
            tip: "Aligns content horizontally within the section.",
          },
          alignItems: {
            label: "Vertical Align",
            type: "select",
            options: [
              { value: "items-start", label: "Start" },
              { value: "items-center", label: "Center" },
              { value: "items-end", label: "End" },
            ],
            default: "items-center",
            tip: "Aligns content vertically within the section.",
          },
        },
      },
      imageSize: {
        label: "Image Size",
        type: "composite",
        fields: {
          width: {
            label: "Width",
            type: "number",
            default: 0,
            placeholder: "In pixels",
          },
          height: {
            label: "Height",
            type: "number",
            default: 0,
            placeholder: "In pixels",
          },
        },
      },
    },
    animation: {
      ...fieldAnimation("textAnimation", "Text Animation"),
      ...fieldAnimation("imageAnimation", "Image Animation"),
      ...fieldScrolltrigger("scrollTrigger", "ScrollTrigger"),
    },
  },
};

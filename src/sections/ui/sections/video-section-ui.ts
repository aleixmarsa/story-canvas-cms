import { videoSectionSchema } from "../../validation/sections/video-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";
import { fieldAnimation } from "../animations/field-animation";
import { fieldScrolltrigger } from "../animations/element-scrolltrigger";

export const videoSectionSchemaWithUI: SchemaWithUI<typeof videoSectionSchema> =
  {
    schema: videoSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        title: {
          label: "Title",
          type: "richtext",
          required: true,
        },
        description: {
          label: "Description",
          type: "richtext",
        },
        video: {
          label: "Video",
          type: "url",
          required: true,
          tip: "Video URL (youtube, vimeo, mp4, webm)",
          placeholder: "https://example.com/video.mp4",
        },
      },
      style: {
        ...baseUIStyles,
        videoSize: {
          label: "Video Size",
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
        ...fieldAnimation("videoAnimation", "Video Animation"),
        ...fieldScrolltrigger("scrollTrigger", "ScrollTrigger"),
      },
    },
  };

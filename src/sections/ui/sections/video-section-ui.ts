import { videoSectionSchema } from "../../validation/sections/video-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIAnimation } from "../fields/animation-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";

import type { SchemaWithUI } from "@/types/section-fields";

export const videoSectionSchemaWithUI: SchemaWithUI<typeof videoSectionSchema> =
  {
    schema: videoSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        video: {
          label: "Video",
          type: "video",
          required: true,
        },
        title: {
          label: "Title",
          type: "richtext",
          required: true,
        },
      },
      style: {
        ...baseUIStyles,
      },
      animation: {
        ...baseUIAnimation,
      },
    },
  };

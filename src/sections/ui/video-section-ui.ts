import { videoSectionSchema } from "../validation/video-section-schema";
import { baseUI } from "@/sections/ui/base-fields-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const videoSectionSchemaWithUI: SchemaWithUI<typeof videoSectionSchema> =
  {
    schema: videoSectionSchema,
    ui: {
      ...baseUI,
      video: {
        label: "Video",
        type: "video",
        required: true,
      },
      title: {
        label: "Title",
        type: "text",
        required: true,
      },
    },
  };

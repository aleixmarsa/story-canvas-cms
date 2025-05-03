import { chartSectionSchema } from "../validation/chart-section-schema";
import { baseUI } from "@/sections/ui/base-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const chartSectionSchemaWithUI: SchemaWithUI<typeof chartSectionSchema> =
  {
    schema: chartSectionSchema,
    ui: {
      ...baseUI,
      title: {
        label: "Chart Title",
        type: "text",
        required: true,
        placeholder: "Enter the title of the chart",
      },
      type: {
        label: "Chart Type",
        type: "radio",
        required: true,
        options: [
          { value: "line", label: "Line" },
          { value: "bar", label: "Bar" },
        ],
      },
      xKey: {
        label: "X Axis Key",
        type: "text",
        required: true,
        placeholder: "Enter the key for the X-axis, e.g year",
      },
      yKeys: {
        label: "Y Axis Keys",
        type: "text",
        required: true,
        placeholder:
          "Enter comma-separated keys for Y axis, e.g. meanTemperature,meanPrecipitation ",
      },
      data: {
        label: "Chart Data",
        type: "textarea",
        required: true,
        placeholder:
          'Paste your JSON data, e.g. [{"year": 2020, "meantTemperature": 24, "meanPrecipitation": }, ...]',
      },
    },
  };

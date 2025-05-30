import { chartSectionSchema } from "../../validation/sections/chart-section-schema";
import { baseUIData } from "@/sections/ui/fields/base-fields-ui";
import { baseUIStyles } from "../styles/base-styles-ui";
import type { SchemaWithUI } from "@/types/section-fields";

export const chartSectionSchemaWithUI: SchemaWithUI<typeof chartSectionSchema> =
  {
    schema: chartSectionSchema,
    ui: {
      data: {
        ...baseUIData,
        title: {
          label: "Chart Title",
          type: "richtext",
          required: true,
          placeholder: "Enter the title of the chart",
        },
        description: {
          label: "Chart Description",
          type: "richtext",
          placeholder: "Enter the description of the chart",
        },
        type: {
          label: "Chart Type",
          type: "radio",
          required: true,
          options: [
            { value: "line", label: "Line" },
            { value: "bar", label: "Bar" },
          ],
          default: "line",
        },
        xKey: {
          label: "X Axis Key",
          type: "text",
          required: true,
          placeholder: "Enter the key for the X-axis, e.g year",
          tip: "The key for the X-axis in your data. For example, 'year'.",
        },
        yKeys: {
          label: "Y Axis Keys",
          type: "text",
          required: true,
          placeholder:
            "Enter comma-separated keys for Y axis, e.g. meanTemperature,meanPrecipitation ",
          tip: "The keys for the Y-axis in your data. For example, 'meanTemperature,meanPrecipitation'.",
        },
        data: {
          label: "Chart Data",
          type: "textarea",
          required: true,
          placeholder:
            'Paste your JSON data, e.g. [{"year": 2020, "meanTemperature": 24, "meanPrecipitation": }, ...]',
          tip: 'The data for the chart in JSON format. For example, [{"year": 2020, "meanTemperature": 24, "meanPrecipitation": 100}, ...]',
        },
      },
      style: {
        ...baseUIStyles,
      },
      animation: {},
    },
  };

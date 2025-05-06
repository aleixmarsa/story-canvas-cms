import { z } from "zod";
import { baseFields } from "@/sections/validation/section-base-fields-schema";

const isValidJson = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
};

export const chartSectionSchema = baseFields.extend({
  title: z.string().min(1, "Chart title is required"),

  type: z.enum(["line", "bar"], {
    required_error: "You must select a chart type",
  }),

  xKey: z.string().min(1, "You must specify the key for the X-axis"),

  yKeys: z
    .string()
    .regex(
      /^([a-zA-Z0-9_]+)(,[a-zA-Z0-9_]+)*$/,
      "Y keys must be comma-separated without spaces"
    ),

  data: z
    .string()
    .refine(isValidJson, { message: "Data must be a valid JSON array" }),
});

export type ChartSectionSchema = typeof chartSectionSchema;
export type ChartSectionProps = z.infer<typeof chartSectionSchema>;

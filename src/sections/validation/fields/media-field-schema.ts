import { z } from "zod";

export const mediaFieldSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string(),
});

export const mediaFieldSchemaOrString = z.union([
  mediaFieldSchema,
  z.string().url(),
]);

export type MediaField = z.infer<typeof mediaFieldSchema>;

export type MediaFieldOrString = z.infer<typeof mediaFieldSchemaOrString>;

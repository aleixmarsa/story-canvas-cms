import { z } from "zod";

export const mediaFieldSchema = z.union([
  z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string(),
  }),
  z.string().url("Invalid image URL"),
]);

export type MediaField = z.infer<typeof mediaFieldSchema>;

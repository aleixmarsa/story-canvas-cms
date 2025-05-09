import { z } from "zod";

export const mediaFieldSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string(),
});

export type MediaField = z.infer<typeof mediaFieldSchema>;

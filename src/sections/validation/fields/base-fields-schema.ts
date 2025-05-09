import { z } from "zod";

export const baseFields = z.object({
  name: z.string().min(1, "Name is required"),
  createdBy: z.string().min(1, "Author is required"),
});

export type BaseFields = z.infer<typeof baseFields>;

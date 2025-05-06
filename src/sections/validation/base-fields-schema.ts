import { z } from "zod";
import { animationSchema } from "./animation-field-schema";

export const baseFields = z.object({
  name: z.string().min(1, "Name is required"),
  createdBy: z.string().min(1, "Author is required"),
  animation: animationSchema.optional(),
});

export type BaseFields = z.infer<typeof baseFields>;

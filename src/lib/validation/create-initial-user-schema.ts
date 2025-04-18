import { z } from "zod";
import { baseUserSchema } from "./base-user-schema";

export const createInitialUserSchema = baseUserSchema
  .omit({ role: true })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateInitialUserInput = z.infer<typeof createInitialUserSchema>;

import { z } from "zod";
import { baseUserSchema } from "./base-user-schema";

export const createUserSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type CreateUserInput = z.infer<typeof createUserSchema>;

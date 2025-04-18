import { z } from "zod";
import { Role } from "@prisma/client";

// Base schema sense refinaments
export const baseUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
  role: z.nativeEnum(Role),
});

import { z } from "zod";
import { Role } from "@prisma/client";

export const sessionPayloadSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(Role),
  expiresAt: z.union([z.string(), z.date()]),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

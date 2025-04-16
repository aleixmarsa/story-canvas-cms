import { z } from "zod";

export const sessionPayloadSchema = z.object({
  userId: z.string().min(1),
  expiresAt: z.union([z.string(), z.date()]), // el payload podria contenir string
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

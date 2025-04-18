import { Role } from "@prisma/client";

/**
 * Verified session after decrypting the JWT
 */
export type VerifiedSession = {
  id: string;
  role: Role;
};

/**
 * User object returned form getCurrentUser()
 */
export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
};

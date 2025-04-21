import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import prisma from "@/lib/prisma";
import type { VerifiedSession, CurrentUser } from "@/types/auth";

/**
 * Verifies the session by checking if the session cookie exists and decrypting it.
 *
 * @returns {Promise<{ id: string; role: string }>} The user ID and role if the session is valid.
 */
export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect(ROUTES.login);

  const payload = await decrypt(session);
  if (!payload?.userId) redirect(ROUTES.login);

  return {
    id: payload.userId,
    role: payload.role,
  };
});

/**
 * Fetches the current user from the database based on the session ID.
 *
 * @returns {Promise<{ id: string; email: string: role: Role; createdAt: Date } | null>} The user object if found, otherwise null.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.log("Failed to fetch user: ", error);
    redirect(ROUTES.login);
  }
});

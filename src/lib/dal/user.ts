import "server-only";
import { verifySession } from "@/lib/dal/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { Role } from "@prisma/client";
import { UserForTable } from "@/types/user";

/**
 * Fetches all users from the database.
 * @returns {Promise<{ UserForTable }[]>} - A promise that resolves to an array of users
 */
export const getAllUsers = async (): Promise<UserForTable[]> => {
  const session = await verifySession();

  if (session.role !== Role.ADMIN) {
    redirect(ROUTES.dashboard);
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    redirect(ROUTES.dashboard);
  }
};

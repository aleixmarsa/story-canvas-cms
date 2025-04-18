"use server";

import { verifySession } from "@/lib/dal/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Deletes a user from the database.
 * @param userId - The ID of the user to delete.
 * @returns A success message or an error message.
 */
export const deleteUser = async (userId: string) => {
  try {
    const session = await verifySession();

    if (session.role !== Role.ADMIN) {
      return { error: "Unauthorized" };
    }

    if (session.id === userId) {
      return { error: "You cannot delete your own account." };
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return { error: "User not found" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Internal server error" };
  }
};

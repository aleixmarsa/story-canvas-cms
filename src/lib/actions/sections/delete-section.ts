"use server";

import { verifySession } from "@/lib/dal/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Deletes a section and all its versions.
 * @param sectionId - The ID of the section to delete.
 * @returns A success or error message.
 */
export const deleteSection = async (sectionId: number) => {
  try {
    const session = await verifySession();

    if (session.role !== Role.ADMIN) {
      return { error: "Unauthorized" };
    }

    const existingSection = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { versions: true },
    });

    if (!existingSection) {
      return { error: "Section not found" };
    }

    await prisma.$transaction([
      prisma.sectionVersion.deleteMany({
        where: { sectionId },
      }),
      prisma.section.delete({
        where: { id: sectionId },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete section:", error);
    return { error: "Internal server error" };
  }
};

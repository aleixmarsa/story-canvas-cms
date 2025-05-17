"use server";

import { verifySession } from "@/lib/dal/auth";
import prisma from "@/lib/prisma";

export const updateSectionVersionOrders = async (
  updates: { versionId: number; order: number }[]
) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  try {
    await Promise.all(
      updates.map(({ versionId, order }) =>
        prisma.sectionVersion.update({
          where: { id: versionId, section: { deletedAt: null } },
          data: { order },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to update section orders:", error);
    return { error: "Failed to update section orders" };
  }
};

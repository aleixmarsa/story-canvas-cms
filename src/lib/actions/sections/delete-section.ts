"use server";

import { verifySession } from "@/lib/dal/auth";
import {
  getSectionWithVersions,
  deleteSectionWithVersions,
} from "@/lib/dal/sections";

/**
 * Deletes a section and all its versions.
 * @param sectionId - The ID of the section to delete.
 * @returns A success or error message.
 */
export const deleteSection = async (sectionId: number) => {
  try {
    const session = await verifySession();
    if (!session) return { error: "Unauthorized" };

    const existingSection = await getSectionWithVersions(sectionId);
    if (!existingSection) return { error: "Section not found" };

    await deleteSectionWithVersions(sectionId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete section:", error);
    return { error: "Internal server error" };
  }
};

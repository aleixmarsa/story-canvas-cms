"use server";

import { verifySession } from "@/lib/dal/auth";
import {
  getSectionWithVersions,
  deleteSectionWithVersions,
} from "@/lib/dal/sections";
import { ImageSectionProps } from "@/sections/validation/image-section-schema";
import { deleteCloudinaryMedia } from "../cloudinary/delete-media";

/**
 * Deletes a section and all of its associated versions.
 *
 * @param sectionId - The ID of the section to delete.
 *
 * @returns An object with:
 * - `{ success: true }` if deletion was successful.
 * - `{ error: string }` if the user is unauthorized, the section doesn't exist or an internal error occurs.
 *
 * @throws Error - If an unexpected exception occurs during deletion.
 */
export const deleteSection = async (sectionId: number) => {
  try {
    const session = await verifySession();
    if (!session) return { error: "Unauthorized" };

    const existingSection = await getSectionWithVersions(sectionId);
    if (!existingSection) return { error: "Section not found" };

    const media = (existingSection.currentDraft?.content as ImageSectionProps)
      ?.image;
    const publicId = typeof media === "object" ? media.publicId : undefined;

    if (publicId) {
      await deleteCloudinaryMedia(publicId);
    }

    await deleteSectionWithVersions(sectionId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete section:", error);
    return { error: "Internal server error" };
  }
};

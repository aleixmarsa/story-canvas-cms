"use server";

import { verifySession } from "@/lib/dal/auth";
import {
  getStoryWithSectionsAndVersions,
  hardDeleteStoryAndRelated,
  softDeleteStoryAndRelated,
} from "@/lib/dal/stories";
import { Role } from "@prisma/client";

/**
 * Hard deletes a Story and its related sections
 *
 * @param storyId - The ID of the story to delete.
 * @returns A success message or an error message.
 * @throws Unauthorized - If the user is not an admin.
 * @throws StoryNotFound - If the story does not exist.
 * @throws InternalServerError - If an internal error occurs.
 */
export const hardDeleteStory = async (storyId: number) => {
  try {
    const session = await verifySession();
    if (!session || session.role !== Role.ADMIN)
      return { error: "Unauthorized" };

    const existingStory = await getStoryWithSectionsAndVersions(storyId);
    if (!existingStory) return { error: "Story not found" };

    await hardDeleteStoryAndRelated(storyId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete story:", error);
    return { error: "Internal server error" };
  }
};

/**
 * Soft deletes a Story and its related sections
 *
 * @param storyId - The ID of the story to delete.
 * @returns A success message or an error message.
 * @throws Unauthorized - If the user is not an admin.
 * @throws StoryNotFound - If the story does not exist.
 * @throws InternalServerError - If an internal error occurs.
 */
export const softDeleteStory = async (storyId: number) => {
  try {
    const session = await verifySession();
    if (!session || session.role !== Role.ADMIN)
      return { error: "Unauthorized" };

    const existingStory = await getStoryWithSectionsAndVersions(storyId);
    if (!existingStory) return { error: "Story not found" };

    await softDeleteStoryAndRelated(storyId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete story:", error);
    return { error: "Internal server error" };
  }
};

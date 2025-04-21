"use server";

import { verifySession } from "@/lib/dal/auth";
import {
  getStoryWithSectionsAndVersions,
  deleteStoryAndRelated,
} from "@/lib/dal/stories";
import { Role } from "@prisma/client";

/**
 * Creates a new Story and its initial draft version inside a transaction.
 *
 * @param data - The data required to create the draft story version, including title, slug, theme, etc.
 *               Must include `createdBy`, which links the story to its creator.
 * @returns The updated Story including its current draft and published version.
 *
 * @throws ConflictError - If the slug is already used by another story.
 * @throws Prisma.PrismaClientKnownRequestError - If a database-level constraint fails.
 */
export const deleteStory = async (storyId: number) => {
  try {
    const session = await verifySession();
    if (session.role !== Role.ADMIN) return { error: "Unauthorized" };

    const existingStory = await getStoryWithSectionsAndVersions(storyId);
    if (!existingStory) return { error: "Story not found" };

    await deleteStoryAndRelated(storyId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete story:", error);
    return { error: "Internal server error" };
  }
};

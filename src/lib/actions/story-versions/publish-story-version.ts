"use server";

import { publishStoryVersion as publishInDb } from "@/lib/dal/story-versions";
import { verifySession } from "@/lib/dal/auth";

/**
 * Publishes a story version and creates a new draft copy.
 *
 * @param versionId - The ID of the story version to publish.
 * @returns The updated story object or an error.
 */
export const publishStoryVersion = async (versionId: number) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  try {
    const story = await publishInDb(versionId);
    return { success: true, story };
  } catch (error) {
    if (error instanceof Error && error.message === "Story version not found") {
      return { error: "Story version not found" };
    }

    console.error("Failed to publish story version:", error);
    return { error: "Internal server error" };
  }
};

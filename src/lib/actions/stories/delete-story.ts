"use server";

import { verifySession } from "@/lib/dal/auth";
import {
  getStoryWithSectionsAndVersions,
  deleteStoryAndRelated,
} from "@/lib/dal/stories";
import { Role } from "@prisma/client";

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

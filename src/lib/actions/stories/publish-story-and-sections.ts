"use server";

import { verifySession } from "@/lib/dal/auth";
import { Role } from "@prisma/client";
import { publishStoryVersion } from "@/lib/dal/story-versions";
import { publishSectionVersion } from "@/lib/dal/section-versions";
import { getSectionsByStoryId } from "@/lib/dal/sections";

/**
 * Publishes the current story version and all current draft section versions.
 *
 * @param storyVersionId - The ID of the StoryVersion to publish.
 * @param storyId - The ID of the parent Story.
 * @returns The updated story or an error.
 */
export const publishStoryAndSections = async (
  storyVersionId: number,
  storyId: number
) => {
  const session = await verifySession();
  if (!session || session.role !== Role.ADMIN) return { error: "Unauthorized" };

  try {
    // Publish the story version
    const story = await publishStoryVersion(storyVersionId);

    // Get all sections for the story
    const sections = await getSectionsByStoryId(storyId);

    for (const section of sections) {
      if (section.currentDraft?.status === "draft") {
        await publishSectionVersion(section.currentDraft.id);
      }
    }

    return { success: true, story };
  } catch (error) {
    console.error("Failed to publish story and sections:", error);
    return { error: "Internal server error" };
  }
};

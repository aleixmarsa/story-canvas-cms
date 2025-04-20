"use server";

import { verifySession } from "@/lib/dal/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Deletes a story and all its versions and sections.
 * @param storyId - The ID of the story to delete.
 * @returns A success message or an error message.
 */
export const deleteStory = async (storyId: number) => {
  try {
    const session = await verifySession();

    if (session.role !== Role.ADMIN) {
      return { error: "Unauthorized" };
    }

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        versions: true,
        sections: {
          include: {
            versions: true,
          },
        },
      },
    });

    if (!existingStory) {
      return { error: "Story not found" };
    }

    await prisma.$transaction([
      // Deletes all the SectionVersions associated with the Sections
      prisma.sectionVersion.deleteMany({
        where: {
          section: {
            storyId,
          },
        },
      }),

      // Delete all the Sections associated with the Story
      prisma.section.deleteMany({
        where: {
          storyId,
        },
      }),

      // Delete all the StoryVersions associated with the Story
      prisma.storyVersion.deleteMany({
        where: {
          storyId,
        },
      }),

      // Delete the Story itself
      prisma.story.delete({
        where: {
          id: storyId,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete story:", error);
    return { error: "Internal server error" };
  }
};

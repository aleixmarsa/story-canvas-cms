import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { StoryStatus } from "@prisma/client";
import { StoryFormData } from "../validation/story-schemas";

/**
 * Gets a story by its ID, including its sections and versions.
 *
 * @param storyId - The ID of the story to retrieve.
 * @returns The story with its sections and versions, or null if not found.
 */
export const getStoryWithSectionsAndVersions = async (storyId: number) => {
  return prisma.story.findUnique({
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
};

/**
 * Deletes a story and all its related sections and versions.
 *
 * @param storyId - The ID of the story to delete.
 * @returns A promise that resolves when the deletion is complete.
 * @throws Prisma.PrismaClientKnownRequestError if deletion fails.
 */
export const deleteStoryAndRelated = async (storyId: number) => {
  return prisma.$transaction([
    prisma.sectionVersion.deleteMany({
      where: {
        section: { storyId },
      },
    }),
    prisma.section.deleteMany({
      where: { storyId },
    }),
    prisma.storyVersion.deleteMany({
      where: { storyId },
    }),
    prisma.story.delete({
      where: { id: storyId },
    }),
  ]);
};

/**
 * Creates a new story and its initial draft version.
 *
 * @param data - The data used to create the StoryVersion and link it to the Story.
 *
 * @returns The created story with the draft version linked as currentDraft.
 *
 * @throws ConflictError if the slug already exists for another story.
 */
export const createStoryWithDraft = async (data: StoryFormData) => {
  return await prisma.$transaction(async (tx) => {
    const story = await tx.story.create({
      data: {
        lastEditedBy: data.createdBy,
      },
    });

    const conflicting = await tx.storyVersion.findFirst({
      where: {
        slug: data.slug,
        storyId: { not: story.id },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const draftVersion = await tx.storyVersion.create({
      data: {
        ...data,
        storyId: story.id,
        status: StoryStatus.draft,
      },
    });

    return tx.story.update({
      where: { id: story.id },
      data: {
        currentDraftId: draftVersion.id,
      },
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
    });
  });
};

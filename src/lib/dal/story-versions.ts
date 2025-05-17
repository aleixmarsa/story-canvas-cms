import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ConflictError } from "@/lib/errors";
import { StoryStatus } from "@prisma/client";

/**
 * Checks if a slug is already used by a version in a different story.
 
 * @param slug - The slug to check for conflicts.
 * @param currentStoryId - The ID of the story to exclude from the check.
 *
 * @throws ConflictError - If the slug is already used by a version in another story.
 */
export const checkSlugConflictAcrossStories = async (
  slug: string,
  currentStoryId: number | undefined
) => {
  if (!currentStoryId) {
    throw new ConflictError("Current story ID is required");
  }
  const conflict = await prisma.storyVersion.findFirst({
    where: {
      slug,
      storyId: {
        not: currentStoryId,
      },
    },
  });

  if (conflict) {
    throw new ConflictError("Slug already exists");
  }
};

/**
 * Updates a StoryVersion in the database by its ID.
 *
 * @param id - The ID of the story version to update.
 * @param data - The fields to update (e.g., title, slug, description, theme, etc.).
 *
 * @returns The updated StoryVersion object.
 *
 * @throws Prisma.PrismaClientKnownRequestError - If the update operation fails due to a constraint violation.
 */
export const updateStoryVersionById = async (
  id: number,
  data: Prisma.StoryVersionUpdateInput
) => {
  return prisma.storyVersion.update({
    where: { id },
    data,
  });
};

/**
 * Publishes the story version (metadata) and creates a new draft copy.
 *
 * @param versionId - The ID of the version to publish.
 * @returns The updated story with current draft and published versions.
 *
 * @throws Error - If the original version does not exist or the operation fails.
 */
export const publishStoryVersion = async (versionId: number) => {
  return prisma.$transaction(async (tx) => {
    const original = await tx.storyVersion.findUnique({
      where: { id: versionId },
    });

    if (!original) {
      throw new Error("Story version not found");
    }

    const publishedVersion = await tx.storyVersion.update({
      where: { id: versionId },
      data: {
        status: StoryStatus.published,
      },
    });

    const draftCopy = await tx.storyVersion.create({
      data: {
        storyId: original.storyId,
        title: original.title,
        slug: original.slug,
        description: original.description ?? undefined,
        status: StoryStatus.draft,
        createdBy: original.createdBy ?? undefined,
        comment: `Auto-generated draft after publishing version ${original.id}`,
      },
    });

    return tx.story.update({
      where: { id: original.storyId },
      data: {
        publishedVersionId: publishedVersion.id,
        currentDraftId: draftCopy.id,
        publicSlug: publishedVersion.slug,
        publishedAt: new Date(),
        lastEditedBy: publishedVersion.createdBy ?? undefined,
      },
      include: {
        publishedVersion: true,
        currentDraft: true,
      },
    });
  });
};

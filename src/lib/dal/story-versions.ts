import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ConflictError } from "@/lib/errors";

/**
 * Checks if a slug is already used by a version in a different story.
 
 * @param slug - The slug to check for conflicts.
 * @param currentStoryId - The ID of the story to exclude from the check.
 *
 * @throws ConflictError - If the slug is already used by a version in another story.
 */
export const checkSlugConflictAcrossStories = async (
  slug: string,
  currentStoryId: number
) => {
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

import "server-only";
import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { StoryStatus } from "@prisma/client";
import { slugify } from "../utils";
import type { SectionFormData } from "../validation/section-version";

/**
 * Gets a section with its current draft and published version.
 *
 * @param sectionId - The section ID.
 * @returns The full section.
 */
export const getSectionWithVersions = async (sectionId: number) => {
  return prisma.section.findUnique({
    where: { id: sectionId, deletedAt: null },
    include: {
      currentDraft: true,
      publishedVersion: true,
    },
  });
};

/**
 * Hard deletes a section and all its related versions.
 *
 * @param sectionId - The ID of the section to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const hardDeleteSectionWithVersions = async (sectionId: number) => {
  return prisma.$transaction([
    prisma.sectionVersion.deleteMany({
      where: { sectionId },
    }),
    prisma.section.delete({
      where: { id: sectionId },
    }),
  ]);
};

/**
 * Soft deletes a section and all its related versions.
 *
 * @param sectionId - The ID of the section to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const softDeleteSectionWithVersions = async (sectionId: number) => {
  const now = new Date();

  return prisma.section.update({
    where: { id: sectionId },
    data: {
      deletedAt: now,
    },
  });
};

/**
 * Creates a new Section and its initial draft version.
 *
 * @param input - The data needed to create the section and draft version.
 * @returns The created Section with its current draft version.
 *
 * @throws ConflictError - If the slug already exists in another section of the same story.
 * @throws Error - If the transaction fails.
 */
export const createSectionWithDraftVersion = async (data: SectionFormData) => {
  const slug = slugify(data.name);

  return prisma.$transaction(async (tx) => {
    const numberOfSections = await tx.section.count({
      where: { storyId: data.storyId },
    });
    const section = await tx.section.create({
      data: {
        storyId: data.storyId,
        lastEditedBy: data.createdBy,
        lockedBy: data.createdBy,
      },
    });

    const conflicting = await tx.sectionVersion.findFirst({
      where: {
        slug,
        section: {
          storyId: data.storyId,
          id: {
            not: section.id,
          },
          deletedAt: null,
        },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const draftVersion = await tx.sectionVersion.create({
      data: {
        sectionId: section.id,
        name: data.name,
        slug,
        type: data.type,
        order: numberOfSections,
        content: data.content || {},
        createdBy: data.createdBy,
        status: StoryStatus.draft,
      },
    });

    return tx.section.update({
      where: { id: section.id },
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

/**
 * Checks if a slug is already used in another section of the same story.
 *
 * @param slug - The slug to check.
 * @param storyId - The story ID for context.
 * @param excludeSectionId - Section to exclude from the check (typically the current one).
 *
 * @throws ConflictError if a conflict is found.
 */
export const checkSectionSlugConflict = async (
  slug: string,
  storyId: number,
  excludeSectionId: number
) => {
  const conflicting = await prisma.sectionVersion.findFirst({
    where: {
      slug,
      section: {
        storyId,
        id: { not: excludeSectionId },
        deletedAt: null,
      },
    },
  });

  if (conflicting) {
    throw new ConflictError("Slug already exists");
  }
};

/**
 * Fetches all sections for a given story, including their current draft and published versions.
 *
 * @param storyId - The ID of the story.
 * @returns A list of sections with their current draft and published versions.
 */

export const getSectionsByStoryId = async ({
  storyId,
  orderBy = "createdAt",
  order = "asc",
}: {
  storyId: number;
  orderBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}) => {
  const sections = await prisma.section.findMany({
    where: { storyId, deletedAt: null },
    include: {
      currentDraft: true,
      publishedVersion: true,
    },
    orderBy: {
      [orderBy]: order,
    },
  });

  return sections;
};

import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { SectionType, StoryStatus } from "@prisma/client";
import { slugify } from "../utils";

/**
 * Gets a section by its ID, including its versions.
 *
 * @param sectionId - The ID of the section to retrieve.
 * @returns The section with its versions, or null if not found.
 */
export const getSectionWithVersions = async (sectionId: number) => {
  return prisma.section.findUnique({
    where: { id: sectionId },
    include: { versions: true },
  });
};

/**
 * Deletes a section and all its related versions.
 *
 * @param sectionId - The ID of the section to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteSectionWithVersions = async (sectionId: number) => {
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
 * Creates a new Section and its initial draft version.
 *
 * @param input - The data needed to create the section and draft version.
 * @returns The created Section with its current draft version.
 *
 * @throws ConflictError - If the slug already exists in another section of the same story.
 * @throws Error - If the transaction fails.
 */
export const createSectionWithDraftVersion = async (input: {
  storyId: number;
  name: string;
  type: SectionType;
  order: number;
  content: unknown;
  createdBy: string;
}) => {
  const slug = slugify(input.name);

  return prisma.$transaction(async (tx) => {
    const section = await tx.section.create({
      data: {
        storyId: input.storyId,
        lastEditedBy: input.createdBy,
        lockedBy: input.createdBy,
      },
    });

    const conflicting = await tx.sectionVersion.findFirst({
      where: {
        slug,
        section: {
          storyId: input.storyId,
          id: {
            not: section.id,
          },
        },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const draftVersion = await tx.sectionVersion.create({
      data: {
        sectionId: section.id,
        name: input.name,
        slug,
        type: input.type,
        order: input.order,
        content: input.content || {},
        createdBy: input.createdBy,
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

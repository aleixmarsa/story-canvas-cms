import "server-only";
import prisma from "@/lib/prisma";
import { slugify } from "../utils";
import { Prisma } from "@prisma/client";
import type { SectionCategory } from "@/sections/section-categories";

type UpdateSectionVersion = {
  name: string;
  slug: string;
  type: SectionCategory;
  order: number;
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  comment: string | undefined;
};

/**
 * Updates a section version by its ID.
 *
 * @param versionId - The ID of the SectionVersion.
 * @param data - The fields to update.
 * @returns The updated SectionVersion.
 */
export const updateSectionVersionById = async (
  versionId: number,
  data: UpdateSectionVersion
) => {
  return prisma.sectionVersion.update({
    where: { id: versionId },
    data,
  });
};

/**
 * Publishes a SectionVersion and creates a new draft version.
 *
 * @param versionId - ID of the SectionVersion to publish
 * @returns The updated Section with published and draft versions included
 */
export const publishSectionVersion = async (versionId: number) => {
  return prisma.$transaction(async (tx) => {
    const original = await tx.sectionVersion.findUnique({
      where: { id: versionId },
    });

    if (!original) {
      throw new Error("Section version not found");
    }

    const publishedVersion = await tx.sectionVersion.update({
      where: { id: versionId },
      data: {
        status: "published",
      },
    });

    const draftCopy = await tx.sectionVersion.create({
      data: {
        sectionId: original.sectionId,
        slug: slugify(original.name),
        name: original.name,
        type: original.type,
        order: original.order,
        content: original.content ?? Prisma.JsonNull,
        status: "draft",
        createdBy: original.createdBy ?? undefined,
        comment: `Auto-generated draft after publishing version ${original.id}`,
      },
    });

    return tx.section.update({
      where: { id: original.sectionId },
      data: {
        publishedVersionId: publishedVersion.id,
        currentDraftId: draftCopy.id,
        publishedAt: new Date(),
        lastEditedBy: publishedVersion.createdBy ?? undefined,
        lockedBy: null,
      },
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
    });
  });
};

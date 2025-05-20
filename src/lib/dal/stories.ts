import "server-only";
import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { StoryStatus } from "@prisma/client";
import { StoryFormData } from "../validation/story-schemas";
import { RenderStoryData } from "@/types/story";

/**
 * Fetches all stories with their current draft and published version metadata.
 * Optionally includes their sections.
 * Optionally orders the response
 * @returns An array of stories including current draft and published versions metadata.
 */
export const getAllStories = async ({
  includeSections = false,
  orderBy = "updatedAt",
  order = "desc",
}: {
  includeSections?: boolean;
  orderBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}) => {
  return prisma.story.findMany({
    include: {
      currentDraft: true,
      publishedVersion: true,
      sections: includeSections
        ? {
            where: {
              deletedAt: null,
            },
            include: {
              currentDraft: true,
              publishedVersion: true,
            },
          }
        : false,
    },

    orderBy: {
      [orderBy]: order,
    },
    where: {
      deletedAt: null,
    },
  });
};

/**
 * Gets a story by its ID
 * Optionally includes their sections.
 * @param storyId - The ID of the story to retrieve.
 * @returns The story with its sections and versions, or null if not found.
 */
export const getStory = async ({
  storyId,
  includeSections = false,
}: {
  storyId: number;
  includeSections?: boolean;
  includeVersions?: boolean;
}) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId, deletedAt: null },
    include: {
      currentDraft: true,
      publishedVersion: true,
      sections: includeSections
        ? {
            where: {
              deletedAt: null,
            },
            include: {
              currentDraft: true,
              publishedVersion: true,
            },
          }
        : false,
    },
  });

  return story;
};

/**
 * Gets a story by its ID, including its sections and versions.
 *
 * @param storyId - The ID of the story to retrieve.
 * @returns The story with its sections and versions, or null if not found.
 */
export const getStoryWithSectionsAndVersions = async (storyId: number) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId, deletedAt: null },
    include: {
      versions: true,
      sections: {
        include: {
          versions: true,
        },
      },
    },
  });

  return story;
};

/**
 * Hard deletes a story and all its related sections and versions.
 *
 * @param storyId - The ID of the story to delete.
 * @returns A transaction that removes all linked data (section versions, sections, story versions, story).
 * @throws Prisma.PrismaClientKnownRequestError if any deletion fails.
 */
export const hardDeleteStoryAndRelated = async (storyId: number) => {
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
 * Soft deletes a story and all its related sections.
 *
 * @param storyId - The ID of the story to soft delete.
 * @returns A transaction that sets `deletedAt` on story and sections.
 * @throws Prisma.PrismaClientKnownRequestError if the transaction fails.
 */
export const softDeleteStoryAndRelated = async (storyId: number) => {
  const now = new Date();

  return prisma.$transaction([
    prisma.section.updateMany({
      where: {
        storyId,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),
    prisma.story.update({
      where: {
        id: storyId,
      },
      data: {
        deletedAt: now,
      },
    }),
  ]);
};

/**
 * Creates a new Story and an initial draft StoryVersion linked to it.
 *
 * @param data - The form data including title, slug, content, theme, createdBy, etc.
 * @returns The created Story including its current draft and published version (null).
 * @throws ConflictError if the slug is already used by another story version.
 */

type CreateStoryWithDraftResponse = StoryFormData & {
  creatorId: string;
};

export const createStoryWithDraft = async (
  data: CreateStoryWithDraftResponse
) => {
  return await prisma.$transaction(async (tx) => {
    const story = await tx.story.create({
      data: {
        lastEditedBy: data.createdBy,
      },
    });

    const { creatorId, ...cleanData } = data;

    const conflicting = await tx.storyVersion.findFirst({
      where: {
        slug: cleanData.slug,
        storyId: { not: story.id },
        story: { deletedAt: null },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const draftVersion = await tx.storyVersion.create({
      data: {
        ...cleanData,
        storyId: story.id,
        status: StoryStatus.draft,
      },
    });

    const updatedStory = await tx.story.update({
      where: { id: story.id },
      data: {
        currentDraftId: draftVersion.id,
        creatorId: creatorId,
      },
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
    });

    return updatedStory;
  });
};

/**
 * Fetches a draft story by its current draft slug, including all draft sections.
 *
 * @param slug - The slug of the current draft story version.
 * @returns A flattened object structure for use in live preview rendering.
 */
export async function getDraftStoryBySlug(
  slug: string
): Promise<RenderStoryData | null> {
  const story = await prisma.story.findFirst({
    where: {
      currentDraft: {
        slug,
      },
      deletedAt: null,
    },
    include: {
      currentDraft: true,
      sections: {
        where: {
          deletedAt: null,
        },
        include: {
          currentDraft: true,
        },
      },
    },
  });

  if (!story || !story.currentDraft) return null;

  return {
    title: story.currentDraft.title,
    description: story.currentDraft.description,
    slug: story.currentDraft.slug,
    sections: story.sections.map((section) => ({
      id: section.currentDraft?.id ?? 0,
      name: section.currentDraft?.name ?? "",
      type: section.currentDraft?.type ?? "",
      order: section.currentDraft?.order ?? 0,
      content: section.currentDraft?.content ?? {},
    })),
  };
}

/**
 * Fetches all public slugs for stories with a published version.
 *
 * @returns An array of objects containing public slugs for stories.
 */
export const getPublishedSlugs = async () => {
  const publicslugs = await prisma.story.findMany({
    where: {
      publishedVersion: { status: "published" },
      deletedAt: null,
    },
    select: {
      publicSlug: true,
    },
  });

  return publicslugs;
};

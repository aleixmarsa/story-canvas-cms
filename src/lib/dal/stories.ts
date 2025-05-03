import "server-only";
import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { StoryStatus } from "@prisma/client";
import { StoryFormData } from "../validation/story-schemas";
import { RenderStoryData } from "@/types/story";

/**
 * Gets a story by its ID, including all its versions and the sections with their versions.
 *
 * @param storyId - The ID of the story to retrieve.
 * @returns The full story with sections and their versions, or null if not found.
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
 * @returns A transaction that removes all linked data (section versions, sections, story versions, story).
 * @throws Prisma.PrismaClientKnownRequestError if any deletion fails.
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
 * Creates a new Story and an initial draft StoryVersion linked to it.
 *
 * @param data - The form data including title, slug, content, theme, createdBy, etc.
 * @returns The created Story including its current draft and published version (null).
 * @throws ConflictError if the slug is already used by another story version.
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

    const updatedStory = await tx.story.update({
      where: { id: story.id },
      data: {
        currentDraftId: draftVersion.id,
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
    },
    include: {
      currentDraft: true,
      sections: {
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
    theme: story.currentDraft.theme,
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
  return prisma.story.findMany({
    where: {
      publishedVersion: { status: "published" },
    },
    select: {
      publicSlug: true,
    },
  });
};

/**
 * Fetches a story by its public slug, including only the published version and published sections.
 *
 * @param slug - The public-facing slug of the story.
 * @returns The story with its published version and published sections, or null if not found.
 */
export const getStoryByPublicSlug = async (slug: string) => {
  return prisma.story.findUnique({
    where: { publicSlug: slug },
    include: {
      publishedVersion: true,
      sections: {
        include: {
          publishedVersion: true,
        },
      },
    },
  });
};

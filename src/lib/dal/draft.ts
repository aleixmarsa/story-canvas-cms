import "server-only";
import prisma from "@/lib/prisma";

export const getAllStoriesWithCurrentDraftMetadata = async () => {
  return prisma.story.findMany({
    select: {
      id: true,
      publishedAt: true,
      currentDraftId: true,
      currentDraft: {
        select: {
          id: true,
          title: true,
          slug: true,
          updatedAt: true,
          createdBy: true,
          description: true,
        },
      },
    },
  });
};

export type StoryDraftMetadata = Awaited<
  ReturnType<typeof getAllStoriesWithCurrentDraftMetadata>
>[number];

export const getDraftSectionsById = async (id: number) => {
  const story = await prisma.story.findUnique({
    where: { id: id },
    include: {
      sections: {
        include: {
          currentDraft: true,
        },
      },
    },
  });

  if (!story) throw new Error("Story not found");

  return story.sections
    .filter((s) => s.currentDraft)
    .map((s) => ({
      id: s.id,
      publishedAt: s.publishedAt,
      currentDraftId: s.currentDraftId,
      currentDraft: {
        id: s.currentDraft!.id,
        name: s.currentDraft!.name,
        type: s.currentDraft!.type,
        order: s.currentDraft!.order,
        content: s.currentDraft!.content,
        updatedAt: s.currentDraft!.updatedAt,
        slug: s.currentDraft!.slug,
        createdBy: s.currentDraft!.createdBy,
      },
    }))
    .sort((a, b) => a.currentDraft.order - b.currentDraft.order);
};

export type SectionDraftMetadata = Awaited<
  ReturnType<typeof getDraftSectionsById>
>[number];

/**
 * Fetches a story by its public slug, including only the published version and published sections.
 *
 * @param slug - The public-facing slug of the story.
 * @returns The story with its published version and published sections, or null if not found.
 */
export const getDraftStoryByStoryId = async (id: number) => {
  return prisma.story.findUnique({
    where: { id: id },
    include: {
      currentDraft: true,
      sections: {
        include: {
          currentDraft: true,
        },
      },
    },
  });
};

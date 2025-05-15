import "server-only";
import prisma from "@/lib/prisma";

type OrderByField = "createdAt" | "updatedAt";
type OrderDirection = "asc" | "desc";

export const getAllStoriesWithCurrentDraftMetadata = async ({
  includeSections = false,
  orderBy = "createdAt",
  order = "asc",
}: {
  includeSections?: boolean;
  orderBy?: OrderByField;
  order?: OrderDirection;
} = {}) => {
  return prisma.story.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
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
      sections: includeSections
        ? {
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
      currentDraftId: { not: null },
    },
  });
};

export type StoryDraftMetadata = Awaited<
  ReturnType<typeof getAllStoriesWithCurrentDraftMetadata>
>[number];

export const getDraftSectionsById = async ({
  storyId,
  orderBy = "order",
  order = "asc",
}: {
  storyId: number;
  orderBy?: "order" | "name" | "type" | "updatedAt" | "createdAt";
  order?: OrderDirection;
}) => {
  const sections = await prisma.section.findMany({
    where: {
      storyId,
      currentDraftId: { not: null }, // Ens assegurem que en tinguin
    },
    include: {
      currentDraft: true,
    },
    orderBy: {
      currentDraft: {
        [orderBy]: order,
      },
    },
  });

  return sections.map((s) => ({
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
  }));
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

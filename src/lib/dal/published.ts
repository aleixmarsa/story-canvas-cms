import "server-only";
import prisma from "@/lib/prisma";

export const getPublishedStoryMetadata = async () => {
  return prisma.story.findMany({
    where: {
      publishedVersion: { status: "published" },
    },
    select: {
      id: true,
      publicSlug: true,
      publishedAt: true,
      publishedVersion: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });
};

export const getPublishedSectionsBySlug = async (slug: string) => {
  const story = await prisma.story.findUnique({
    where: { publicSlug: slug },
    include: {
      sections: {
        include: {
          publishedVersion: true,
        },
      },
    },
  });

  if (!story) throw new Error("Story not found");

  return story.sections
    .filter((s) => s.publishedVersion)
    .map((s) => ({
      id: s.publishedVersion!.id,
      name: s.publishedVersion!.name,
      type: s.publishedVersion!.type,
      order: s.publishedVersion!.order,
      content: s.publishedVersion!.content,
    }))
    .sort((a, b) => a.order - b.order);
};

/**
 * Fetches a story by its public slug, including only the published version and published sections.
 *
 * @param slug - The public-facing slug of the story.
 * @returns The story with its published version and published sections, or null if not found.
 */
export const getPublishedStoryByPublicSlug = async (slug: string) => {
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

import prisma from "@/lib/prisma";

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

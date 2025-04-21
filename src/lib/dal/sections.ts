import prisma from "@/lib/prisma";

export const getSectionWithVersions = async (sectionId: number) => {
  return prisma.section.findUnique({
    where: { id: sectionId },
    include: { versions: true },
  });
};

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

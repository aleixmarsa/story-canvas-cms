import prisma from "@/lib/prisma";
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

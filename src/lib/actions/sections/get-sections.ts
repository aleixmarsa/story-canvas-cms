import { getSectionsByStoryId } from "@/lib/dal/sections";
/**
 * Fetches all sections for a given story, including their current draft and published versions.
 *
 * @param storyId - The ID of the story.
 * @returns A list of sections with their current draft and published versions.
 */

export const getSections = async ({
  storyId,
  orderBy = "createdAt",
  order = "asc",
}: {
  storyId: number;
  orderBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}) => {
  const sections = await getSectionsByStoryId({
    storyId,
    orderBy,
    order,
  });

  return sections;
};

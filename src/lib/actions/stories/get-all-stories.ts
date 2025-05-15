import { getAllStories } from "@/lib/dal/stories";

/**
 * Fetches all stories with their current draft and published version metadata.
 * Optionally includes their sections.
 * Optionally orders the response
 * @returns An array of stories including current draft and published versions metadata.
 */
export const getAllStoriesMetadata = async ({
  includeSections = false,
  orderBy = "updatedAt",
  order = "desc",
}: {
  includeSections?: boolean;
  orderBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}) => {
  const stories = await getAllStories({
    includeSections,
    orderBy,
    order,
  });
  return stories;
};

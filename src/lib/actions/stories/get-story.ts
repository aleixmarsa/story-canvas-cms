import { getStory } from "@/lib/dal/stories";
/**
 * Gets a story by its ID
 * Optionally includes their sections.
 * @param storyId - The ID of the story to retrieve.
 * @returns The story with its sections and versions, or null if not found.
 */
export const getStoryMetadata = async ({
  storyId,
  includeSections = false,
}: {
  storyId: number;
  includeSections?: boolean;
  includeVersions?: boolean;
}) => {
  const story = await getStory({
    storyId,
    includeSections,
    includeVersions: true,
  });

  return story;
};

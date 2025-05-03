"use server";
import { getPublishedStoryMetadata } from "@/lib/dal/published";

export const getPublishedStories = async () => {
  try {
    const stories = await getPublishedStoryMetadata();
    return { success: true, stories };
  } catch (error) {
    return { error: `Failed to fetch published stories: ${error}` };
  }
};

"use server";

import { getAllStoriesWithCurrentDraftMetadata } from "@/lib/dal/draft";

export const getCurrentDraftStories = async () => {
  try {
    const stories = await getAllStoriesWithCurrentDraftMetadata();
    return { success: true, stories };
  } catch {
    return { error: "Failed to fetch drafts" };
  }
};

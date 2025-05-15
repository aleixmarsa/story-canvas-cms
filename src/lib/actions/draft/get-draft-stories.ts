"use server";

import { getAllStoriesWithCurrentDraftMetadata } from "@/lib/dal/draft";

type OrderByField = "createdAt" | "updatedAt";
type OrderDirection = "asc" | "desc";

export const getCurrentDraftStories = async ({
  includeSections = false,
  orderBy = "createdAt",
  order = "asc",
}: {
  includeSections?: boolean;
  orderBy?: OrderByField;
  order?: OrderDirection;
} = {}) => {
  try {
    const stories = await getAllStoriesWithCurrentDraftMetadata({
      includeSections,
      orderBy,
      order,
    });

    return { success: true, stories };
  } catch {
    return { error: "Failed to fetch drafts" };
  }
};

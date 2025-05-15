"use server";
import { getPublishedStoryMetadata } from "@/lib/dal/published";

type OrderField = "createdAt" | "updatedAt";
type OrderDirection = "asc" | "desc";

export const getPublishedStories = async ({
  includeSections = false,
  orderBy = "createdAt",
  order = "asc",
}: {
  includeSections?: boolean;
  orderBy?: OrderField;
  order?: OrderDirection;
} = {}) => {
  const stories = await getPublishedStoryMetadata({
    includeSections,
    orderBy,
    order,
  });
  return stories;
};

"use server";

import { getPublishedSectionsByStoryId } from "@/lib/dal/published";

export const fetchPublishedSectionsByStoryId = async ({
  storyId,
  orderBy = "order",
  order = "asc",
}: {
  storyId: number;
  orderBy?: "createdAt" | "updatedAt" | "order" | "type" | "name";
  order?: "asc" | "desc";
}) => {
  const sections = await getPublishedSectionsByStoryId({
    storyId,
    orderBy,
    order,
  });

  return sections;
};

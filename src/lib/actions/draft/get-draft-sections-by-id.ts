"use server";

import { getDraftSectionsById } from "@/lib/dal/draft";

export const getDraftSections = async ({
  storyId,
  orderBy = "order",
  order = "asc",
}: {
  storyId: number;
  orderBy?: "order" | "name" | "type" | "updatedAt" | "createdAt";
  order?: "asc" | "desc";
}) => {
  const sections = await getDraftSectionsById({
    storyId,
    orderBy,
    order,
  });

  return sections;
};

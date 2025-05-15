"use server";

import { getPublishedSectionsBySlug } from "@/lib/dal/published";

export const fetchPublishedSectionsBySlug = async (slug: string) => {
  try {
    const sections = await getPublishedSectionsBySlug(slug);
    return { success: true, sections };
  } catch (error) {
    return { error: `Could not load published sections: ${error}` };
  }
};

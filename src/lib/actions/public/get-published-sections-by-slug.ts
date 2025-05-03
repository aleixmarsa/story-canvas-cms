"use server";

import { getPublishedSectionsBySlug } from "@/lib/dal/public";

export const fetchPublishedSections = async (slug: string) => {
  try {
    const sections = await getPublishedSectionsBySlug(slug);
    return { success: true, sections };
  } catch (error) {
    return { error: `Could not load published sections: ${error}` };
  }
};

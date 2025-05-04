"use server";

import { getDraftSectionsById } from "@/lib/dal/draft";

export const getDraftSections = async (slug: number) => {
  try {
    const sections = await getDraftSectionsById(slug);
    return { success: true, sections };
  } catch {
    return { error: "Could not load draft sections" };
  }
};

"use server";

import {
  checkSectionSlugConflict,
  getSectionWithVersions,
} from "@/lib/dal/sections";
import { updateSectionVersionById } from "@/lib/dal/section-versions";
import { verifySession } from "@/lib/dal/auth";
import { updateSectionVersionSchema } from "@/lib/validation/section-version";
import { ConflictError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import { SectionFormData } from "@/lib/validation/section-version";
import type { SectionCategory } from "@/sections/section-categories";

type UpdateSectionVersionInput = SectionFormData & {
  storyId: number;
  sectionId: number;
};

/**
 * Updates a section version and returns the full updated section.
 *
 * @param versionId - The ID of the SectionVersion to update.
 * @param data - The new values for the section version.
 * @returns An object with either `section` or `error`.
 */
export const updateSectionVersion = async (
  versionId: number,
  data: UpdateSectionVersionInput
) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  const parsed = updateSectionVersionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      error: "Invalid input",
      details: parsed.error.flatten(),
    };
  }

  const { name, type, order, content, comment } = parsed.data;

  const slug = slugify(name);

  const { sectionId, storyId, createdBy } = data;

  try {
    await checkSectionSlugConflict(slug, storyId, sectionId);

    const updatedVersion = await updateSectionVersionById(versionId, {
      name,
      slug: slugify(name),
      type: type as SectionCategory,
      order,
      createdBy,
      content,
      comment,
    });

    const updatedSection = await getSectionWithVersions(
      updatedVersion.sectionId
    );

    return {
      success: true,
      section: updatedSection,
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { error: "Slug already exists", type: "slug" };
    }

    console.error("Failed to update section version:", error);
    return { error: "Internal server error" };
  }
};

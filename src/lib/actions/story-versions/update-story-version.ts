"use server";

import { storySchema } from "@/lib/validation/story-schemas";
import {
  checkSlugConflictAcrossStories,
  updateStoryVersionById,
} from "@/lib/dal/story-versions";
import { verifySession } from "@/lib/dal/auth";
import { ConflictError } from "@/lib/errors";

/**
 * Updates the editable content of a draft story version.
 *
 * @param versionId - The ID of the story version to update.
 * @param data - The new content and metadata for the version.
 * @returns The updated version or an error response.
 */
export const updateStoryVersion = async (versionId: number, data: unknown) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  const parsed = storySchema.safeParse(data);
  if (!parsed.success) {
    return {
      error: "Invalid input",
      details: parsed.error.flatten(),
    };
  }

  const { title, slug, description, createdBy, storyId } = parsed.data;

  try {
    await checkSlugConflictAcrossStories(slug, storyId);

    const updated = await updateStoryVersionById(versionId, {
      title,
      slug,
      description,
      createdBy,
    });

    return {
      success: true,
      version: updated,
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      return {
        error: "Slug already exists",
        type: "slug",
      };
    }

    console.error("Failed to update story version:", error);
    return { error: "Internal server error" };
  }
};

"use server";

import { createStoryWithDraft } from "@/lib/dal/stories";
import { verifySession } from "@/lib/dal/auth";
import { Role } from "@prisma/client";
import { storySchema } from "@/lib/validation/story-schemas";
import { ConflictError } from "@/lib/errors";

/**
 * Creates a new story with the provided form data.
 *
 * @param formData - The form data containing the story details.
 *
 * @returns An object containing either:
 * - `{ success: true, story }` if the creation was successful.
 * - `{ error: string, type?: string, details?: any }` if validation or business rules failed.
 *
 * @throws ConflictError - If the slug is already used by another story.
 * @throws Error - For unexpected internal errors during story creation.
 */
export const createStory = async (formData: FormData) => {
  const session = await verifySession();
  if (!session || session.role !== Role.ADMIN) {
    return { error: "Unauthorized" };
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    createdBy: formData.get("createdBy"),
  };

  const parsed = storySchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Invalid input",
      details: parsed.error.flatten(),
    };
  }

  try {
    const story = await createStoryWithDraft({
      ...parsed.data,
    });

    return {
      success: true,
      story,
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      return {
        error: "Slug already exists",
        type: "slug",
      };
    }

    console.error("Failed to create story:", error);
    return { error: "Internal server error" };
  }
};

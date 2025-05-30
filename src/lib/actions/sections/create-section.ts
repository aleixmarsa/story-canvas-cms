"use server";

import { createSectionWithDraftVersion } from "@/lib/dal/sections";
import { verifySession } from "@/lib/dal/auth";
import { createSectionVersionSchema } from "@/lib/validation/section-version";
import { ConflictError } from "@/lib/errors";

/**
 * Creates a new section and its initial draft version.
 *
 * @param formData - A FormData object containing the new section fields.
 * @returns The created section with its draft version, or an error.
 */
export const createSection = async (formData: FormData) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  const rawData = {
    storyId: Number(formData.get("storyId")),
    name: formData.get("name"),
    type: formData.get("type"),
    content: JSON.parse(formData.get("content") as string),
    createdBy: formData.get("createdBy"),
  };

  const parsed = createSectionVersionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Invalid input",
      details: parsed.error.flatten(),
    };
  }

  const parsedData = {
    ...parsed.data,
    creatorId: session.id,
  };

  try {
    const section = await createSectionWithDraftVersion(parsedData);
    return {
      success: true,
      section,
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      return {
        error: "Slug already exists",
        type: "slug",
      };
    }

    console.error("Failed to create section:", error);
    return { error: "Internal server error" };
  }
};

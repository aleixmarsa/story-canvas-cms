"use server";

import { publishSectionVersion } from "@/lib/dal/section-versions";
import { verifySession } from "@/lib/dal/auth";

/**
 * Publishes a section version and creates a new draft.
 *
 * @param versionId - The ID of the SectionVersion to publish.
 * @returns The updated section or an error.
 */
export const publishSection = async (versionId: number) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  if (isNaN(versionId)) {
    return { error: "Invalid section version ID" };
  }

  try {
    const section = await publishSectionVersion(versionId);
    return {
      success: true,
      section,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Section version not found"
    ) {
      return { error: "Section version not found" };
    }

    console.error("Failed to publish section version:", error);
    return { error: "Internal server error" };
  }
};

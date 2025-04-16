import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { requireAuth } from "@/lib/auth/withAuth";

/**
 * POST /api/section-versions/:id/publish
 * This endpoint requires authentication.
 * Publishes a section version by ID and creates a new draft copy.
 * @param req - The request object.
 * @param params - The parameters object containing the section version ID.
 * @returns The updated section with the published version and new draft copy.
 * @throws 400 - Invalid section version ID.
 * @throws 404 - Section version not found.
 * @throws 500 - Internal server error.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check if the user is authenticated if not return 401
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const resolvedParams = await params;
  const versionId = Number(resolvedParams.id);
  if (isNaN(versionId)) {
    return NextResponse.json(
      { error: "Invalid section version ID" },
      { status: 400 }
    );
  }

  try {
    // Find the version to publish
    const original = await prisma.sectionVersion.findUnique({
      where: { id: versionId },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Section version not found" },
        { status: 404 }
      );
    }

    // Mark the original version as published
    const publishedVersion = await prisma.sectionVersion.update({
      where: { id: versionId },
      data: {
        status: "published",
      },
    });

    // Create a new draft copy
    const draftCopy = await prisma.sectionVersion.create({
      data: {
        sectionId: original.sectionId,
        slug: slugify(original.name),
        name: original.name,
        type: original.type,
        order: original.order,
        content: original.content ?? Prisma.JsonNull,
        status: "draft",
        createdBy: original.createdBy ?? undefined,
        comment: `Auto-generated draft after publishing version ${original.id}`,
      },
    });

    // Update the Section with published + current draft version
    const updatedSection = await prisma.section.update({
      where: { id: original.sectionId },
      data: {
        publishedVersionId: publishedVersion.id,
        currentDraftId: draftCopy.id,
        publishedAt: new Date(),
        lastEditedBy: publishedVersion.createdBy ?? undefined,
        lockedBy: null,
      },
      include: {
        publishedVersion: true,
        currentDraft: true,
      },
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

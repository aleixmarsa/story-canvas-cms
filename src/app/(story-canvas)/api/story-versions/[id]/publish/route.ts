import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/story-versions/:id/publish
// Publishes the given version and creates a new draft copy
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const versionId = Number(resolvedParams.id);
  if (isNaN(versionId)) {
    return NextResponse.json(
      { error: "Invalid story version ID" },
      { status: 400 }
    );
  }

  try {
    // Finds the version to publish
    const original = await prisma.storyVersion.findUnique({
      where: { id: versionId },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Story version not found" },
        { status: 404 }
      );
    }

    // Marks the original as published
    const publishedVersion = await prisma.storyVersion.update({
      where: { id: versionId },
      data: {
        status: "published",
      },
    });

    // Creates a new draft copy
    const draftCopy = await prisma.storyVersion.create({
      data: {
        storyId: original.storyId,
        title: original.title,
        slug: original.slug,
        description: original.description ?? undefined,
        theme: original.theme ?? undefined,
        components: original.components ?? undefined,
        content: original.content ?? undefined,
        status: "draft",
        createdBy: original.createdBy ?? undefined,
        comment: `Auto-generated draft after publishing version ${original.id}`,
      },
    });

    // Updates the Story with new published + draft version
    const updatedStory = await prisma.story.update({
      where: { id: original.storyId },
      data: {
        publishedVersionId: publishedVersion.id,
        currentDraftId: draftCopy.id,
        publicSlug: publishedVersion.slug,
        publishedAt: new Date(),
        lastEditedBy: publishedVersion.createdBy ?? undefined,
      },
      include: {
        publishedVersion: true,
        currentDraft: true,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

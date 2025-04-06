import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/story-versions/:id/duplicate
// Duplicates a story version and sets it as the new current draft
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
    // Get the version to duplicate
    const original = await prisma.storyVersion.findUnique({
      where: { id: versionId },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Story version not found" },
        { status: 404 }
      );
    }

    // Create a new version with copied content
    const newDraft = await prisma.storyVersion.create({
      data: {
        storyId: original.storyId,
        title: original.title,
        slug: `${original.slug}-copy-${Date.now()}`,
        description: original.description ?? undefined,
        theme: original.theme ?? undefined,
        components: original.components ?? undefined,
        content: original.content ?? undefined,
        status: "draft",
        createdBy: original.createdBy,
        comment: `Duplicate of version ${original.id}`,
      },
    });

    // Update the story to point to the new draft
    const updatedStory = await prisma.story.update({
      where: { id: original.storyId },
      data: {
        currentDraftId: newDraft.id,
        lastEditedBy: original.createdBy ?? undefined,
      },
      include: {
        currentDraft: true,
        publishedVersion: true,
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

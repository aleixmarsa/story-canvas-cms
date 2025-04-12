import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stories/:id/published
// Returns a single story published version by ID
// This is used by the public frontend to get the published version of a story
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = parseInt(params.id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      publishedVersion: true,
    },
  });

  if (!story || !story.publishedVersion) {
    return NextResponse.json(
      { error: "Published version not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(story.publishedVersion);
}

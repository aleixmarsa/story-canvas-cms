import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ⚠️ Unused endpoint — preserved for potential future use
/**
 * GET /api/stories/:id/published
 * Returns a single story published version by ID
 * This is used by the public frontend to get the published version of a story
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 * @returns The published version of the story or an error response.
 * @throws 400 - Invalid story ID.
 * @throws 404 - Published version not found.
 * @throws 500 - Internal server error.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = parseInt(params.id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

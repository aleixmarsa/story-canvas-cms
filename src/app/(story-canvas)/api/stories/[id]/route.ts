import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { requireAuth } from "@/lib/auth/withAuth";
/**
 * GET /api/stories/:id
 * Fetches a single story by ID with its current draft, published version, and versions.
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 * @returns The story with its current draft, published version, and versions.
 * @throws 400 - Invalid story ID.
 * @throws 404 - Story not found.
 * @throws 500 - Internal server error.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = parseInt(id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        currentDraft: true,
        publishedVersion: true,
        versions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

// ⚠️ Unused endpoint — preserved for potential future use
/**
 * PATCH /api/stories/:id
 * Updates Story metadata (only fields stored on Story, not the version)
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 * @returns The updated story or an error response.
 * @throws 400 - Invalid story ID.
 * @throws 401 - Unauthorized.
 * @throws 409 - Slug already exists.
 * @throws 500 - Internal server error.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check if the user is authenticated if not return 401
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const resolvedParams = await params;
  const storyId = Number(resolvedParams.id);

  if (isNaN(storyId)) {
    return NextResponse.json({ message: "Invalid story ID" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updated = await prisma.story.update({
      where: { id: storyId },
      data: {
        publicSlug: body.publicSlug,
        lastEditedBy: body.lastEditedBy,
        lockedBy: body.lockedBy ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

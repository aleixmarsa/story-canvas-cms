import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { storySchema } from "@/lib/validation/story-schemas";
import { ConflictError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth/withAuth";

/**
 * GET /api/stories
 * Fetches all stories with their current draft and published version.
 * @returns The list of stories with their current draft and published version.
 * @throws 500 - Internal server error.
 */
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stories
 * Creates a new Story + initial draft version
 * @param req - The request object.
 * @returns The created story with the initial draft version.
 * @throws 401 - Unauthorized.
 * @throws 403 - Forbidden.
 * @throws 409 - Slug already exists.
 * @throws 422 - Validation error.
 * @throws 500 - Internal server error.
 */
export async function POST(req: NextRequest) {
  // Check if the user is authenticated and is an admin if not return 401 or 403
  const user = await requireAdmin();
  if (user instanceof NextResponse) return user;

  const body = await req.json();

  // Validates input
  const parsed = storySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  const { title, slug, description, theme, components, content, createdBy } =
    parsed.data;

  try {
    // If an error occurs, Prisma will throw an error and the transaction will be rolled back.
    // For example, if the slug already exists, the StoryVersion creation will fail and the created Story will be rolled back.
    const result = await prisma.$transaction(async (tx) => {
      // Creates the Story
      const story = await tx.story.create({
        data: {
          lastEditedBy: createdBy,
        },
      });

      // Checks if the slug is already used by another story
      // StoryVersion within the same story can have the same slug
      // For example, a story can have a draft and a published version with the same slug
      const conflicting = await tx.storyVersion.findFirst({
        where: {
          slug,
          storyId: {
            not: story.id,
          },
        },
      });

      if (conflicting) {
        throw new ConflictError("Slug already exists");
      }

      // Creates the initial StoryVersion as draft
      const draftVersion = await tx.storyVersion.create({
        data: {
          title,
          slug,
          description,
          theme,
          components,
          content,
          status: "draft",
          createdBy,
          storyId: story.id,
        },
      });

      // Links the draft to the story
      const updatedStory = await tx.story.update({
        where: { id: story.id },
        data: {
          currentDraftId: draftVersion.id,
        },
        include: {
          currentDraft: true,
        },
      });

      return updatedStory;
    });

    return NextResponse.json(result, { status: 201 });
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
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

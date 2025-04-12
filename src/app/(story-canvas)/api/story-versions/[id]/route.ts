import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { storySchema } from "@/lib/validation/story-schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class ConflictError extends Error {}

// PATCH /api/story-versions/:id
// Updates editable content of a draft version
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const versionId = Number(resolvedParams.id);
  if (isNaN(versionId)) {
    return NextResponse.json(
      { message: "Invalid storyVersion ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = storySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  const {
    title,
    slug,
    description,
    theme,
    components,
    content,
    createdBy,
    storyId,
  } = parsed.data;

  try {
    // Checks if the slug is already used by another story
    // This is necessary because the slug is unique across all stories but
    const conflicting = await prisma.storyVersion.findFirst({
      where: {
        slug,
        storyId: {
          not: storyId,
        },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const updatedVersion = await prisma.storyVersion.update({
      where: { id: versionId },
      data: {
        title,
        slug,
        description,
        theme,
        components,
        content,
        createdBy,
      },
    });

    return NextResponse.json(updatedVersion);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug already exists for this status" },
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

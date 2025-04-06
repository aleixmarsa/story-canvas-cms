import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { storySchema } from "@/lib/validation/storySchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

  const { title, slug, description, theme, components, content, createdBy } =
    parsed.data;

  try {
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

    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { updateSectionVersionSchema } from "@/lib/validation/section-schemas";
import { SectionType } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { ConflictError } from "@/lib/errors";

// PATCH /api/section-versions/:id
// Updates editable content of a draft version
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  debugger;
  const resolvedParams = await params;
  const versionId = Number(resolvedParams.id);

  if (isNaN(versionId)) {
    return NextResponse.json(
      { message: "Invalid sectionVersion ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { sectionId } = body;
  const parsed = updateSectionVersionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  const { name, type, order, content, comment } = parsed.data;

  const slug = slugify(name);

  try {
    const conflicting = await prisma.sectionVersion.findFirst({
      where: {
        slug,
        sectionId: {
          not: sectionId,
        },
      },
    });

    if (conflicting) {
      throw new ConflictError("Slug already exists");
    }

    const updated = await prisma.sectionVersion.update({
      where: { id: versionId },
      data: {
        name,
        slug: slugify(name),
        type: type as SectionType,
        order,
        content,
        comment,
      },
    });

    const updatedSection = await prisma.section.findUnique({
      where: { id: updated.sectionId },
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
    });

    return NextResponse.json(updatedSection);
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
      { message: "Failed to update section version", error },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSectionVersionSchema } from "@/lib/validation/sectionSchemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SectionType } from "@prisma/client";
import { slugify } from "@/lib/utils";

class ConflictError extends Error {}

// POST /api/sections
// Create Section + initial Draft Version
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Validates input
  const parsed = createSectionVersionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  const { storyId, name, type, order, content, createdBy } = parsed.data;

  const slug = slugify(name);

  try {
    // If an error occurs, Prisma will throw an error and the transaction will be rolled back.
    // For example, if the slug already exists, the SectionVersion creation will fail and the created Story will be rolled back.
    const result = await prisma.$transaction(async (tx) => {
      // Creates base Section
      const section = await tx.section.create({
        data: {
          storyId,
          lastEditedBy: createdBy,
          lockedBy: createdBy,
        },
      });

      // Checks if the slug is already used by another section
      // StoryVersion within the same section can have the same slug
      // For example, a section can have a draft and a published version with the same slug
      const conflicting = await tx.sectionVersion.findFirst({
        where: {
          slug,
          sectionId: {
            not: section.id,
          },
        },
      });

      if (conflicting) {
        throw new ConflictError("Slug already exists");
      }

      // Creates initial SectionVersion as draft
      const draftVersion = await tx.sectionVersion.create({
        data: {
          sectionId: section.id,
          name,
          slug,
          type: type as SectionType,
          order,
          content,
          createdBy,
          status: "draft",
        },
      });

      // Links currentDraft
      const updated = await tx.section.update({
        where: { id: section.id },
        data: {
          currentDraftId: draftVersion.id,
        },
        include: {
          currentDraft: true,
        },
      });

      return updated;
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

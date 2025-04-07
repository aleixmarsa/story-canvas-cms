import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSectionVersionSchema } from "@/lib/validation/sectionSchemas";
import { SectionType } from "@prisma/client";

// POST /api/sections
// Create Section + Initial Draft Version
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSectionVersionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  const { storyId, name, type, order, content, createdBy } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Creates base Section
      const section = await tx.section.create({
        data: {
          storyId,
          lastEditedBy: createdBy,
          lockedBy: createdBy,
        },
      });

      // Creates initial draft version
      const draftVersion = await tx.sectionVersion.create({
        data: {
          sectionId: section.id,
          name,
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
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

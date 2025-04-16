import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/sections/:id
 * Updates a Section metadata (only fields stored on Section, not the version)
 * @param req - The request object.
 * @param params - The parameters object containing the section ID.
 * @returns The updated section or an error response.
 * @throws 400 - Invalid section ID.
 * @throws 500 - Internal server error.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const sectionId = Number(resolvedParams.id);

  if (isNaN(sectionId)) {
    return NextResponse.json(
      { message: "Invalid section ID" },
      { status: 400 }
    );
  }

  const body = await req.json();

  try {
    const updated = await prisma.section.update({
      where: { id: sectionId },
      data: {
        lastEditedBy: body.lastEditedBy,
        lockedBy: body.lockedBy ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update section", error },
      { status: 500 }
    );
  }
}

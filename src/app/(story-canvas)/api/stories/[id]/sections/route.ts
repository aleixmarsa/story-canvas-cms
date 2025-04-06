import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stories/:id/sections
// Returns all sections for a specific story
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = Number(params.id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  try {
    const sections = await prisma.section.findMany({
      where: { storyId },
      include: {
        currentDraft: true,
        publishedVersion: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sections", detail: error },
      { status: 500 }
    );
  }
}

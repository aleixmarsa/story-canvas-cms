import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/stories/:id/sections
 * Fetches all sections (draft and published) for a given story ID.
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 * @returns A JSON response with the sections or an error message.
 * @throws 400 - Invalid story ID.
 * @throws 500 - Internal server error.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const storyId = Number(resolvedParams.id);

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

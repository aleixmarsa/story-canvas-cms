import { fetchDraftSections } from "@/lib/actions/internal/get-draft-sections-by-id";
import { NextResponse } from "next/server";
import { getDraftStoryByStoryId } from "@/lib/dal/internal";

/**
 * GET /api/internal/stories/:id/sections
 * Returns all the current drafts sections of a story
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 * @returns The published version of the story or an error response.
 * @throws 400 - Invalid story ID.
 *@throws 404 - Story not found.
 * @throws 500 - Internal server error.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const resolvedParams = await params;
    const storyId = Number(resolvedParams.id);

    if (isNaN(storyId)) {
      return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
    }
    const story = await getDraftStoryByStoryId(storyId);
    if (!story) {
      return NextResponse.json({ error: "Story Not Found" }, { status: 404 });
    }
    const result = await fetchDraftSections(storyId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

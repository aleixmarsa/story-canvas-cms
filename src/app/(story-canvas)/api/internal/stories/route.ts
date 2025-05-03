import { getCurrentDraftStories } from "@/lib/actions/internal/get-draft-stories";
import { NextResponse } from "next/server";

/**
 * GET /api/internal/stories/draft
 * Fetches all published stories metadata
 *
 * @returns The list of published stories with their metadata
 * @throws 500 - Internal server error.
 */
export async function GET() {
  try {
    const result = await getCurrentDraftStories();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

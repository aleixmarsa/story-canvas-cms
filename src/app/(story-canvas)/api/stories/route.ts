import { NextResponse } from "next/server";
import { getAllStories } from "@/lib/dal/stories";

/**
 * GET /api/stories
 * Fetches all stories with their current draft and published version.
 *
 * @returns The list of stories with their current draft and published version.
 * @throws 500 - Internal server error.
 */
export async function GET() {
  try {
    const stories = await getAllStories();
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

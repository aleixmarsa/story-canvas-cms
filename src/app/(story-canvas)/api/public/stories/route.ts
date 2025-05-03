import { NextResponse } from "next/server";
import { getPublishedStories } from "@/lib/actions/public/get-published-stories";

/**
 * GET /api/public/stories
 * Fetches all published stories metadata
 *
 * @returns The list of published stories with their metadata
 * @throws 500 - Internal server error.
 */
export async function GET() {
  try {
    const result = await getPublishedStories();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

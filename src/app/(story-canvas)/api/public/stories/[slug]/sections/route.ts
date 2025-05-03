import { fetchPublishedSections } from "@/lib/actions/public/get-published-sections-by-slug";
import { NextResponse } from "next/server";
import { getPublishedStoryByPublicSlug } from "@/lib/dal/public";

/**
 * GET /api/public/stories/:slug/sections
 * Returns all the published sections of a published story
 * @param req - The request object.
 * @param params - The parameters object containing the story slug.
 * @returns The published version of the story or an error response.
 * @throws 404 - Published version not found.
 * @throws 500 - Internal server error.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const story = await getPublishedStoryByPublicSlug(slug);
    if (!story) {
      return NextResponse.json({ error: "Story Not Found" }, { status: 404 });
    }
    const result = await fetchPublishedSections(slug);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

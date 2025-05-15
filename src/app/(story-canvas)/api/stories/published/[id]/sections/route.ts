import { fetchPublishedSectionsByStoryId } from "@/lib/actions/published/get-published-sections-by-id";
import { getStory } from "@/lib/dal/stories";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  orderBy: z
    .enum(["createdAt", "updatedAt", "order", "type", "name"])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/stories/published/:id/sections
 *
 * Public endpoint that returns all the published sections of a story by ID.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 *
 * @queryParam orderBy - (optional) Field to order by ("createdAt", "updatedAt", "order", "type", "name")
 * @queryParam order - (optional) Order direction ("asc", "desc")
 *
 * @returns Array of published sections or an error response
 * @throws 400 - Invalid ID or query parameters
 * @throws 404 - Story not found or not published
 * @throws 500 - Internal server error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = parseInt(id);
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;
  const parseResult = querySchema.safeParse({
    orderBy: searchParams.get("orderBy") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        errors: parseResult.error.format(),
      },
      { status: 400 }
    );
  }

  const { orderBy, order } = parseResult.data;

  try {
    const story = await getStory({ storyId });
    if (!story || !story.publishedVersionId) {
      return NextResponse.json({ error: "Story Not Found" }, { status: 404 });
    }

    const result = await fetchPublishedSectionsByStoryId({
      storyId,
      orderBy,
      order,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

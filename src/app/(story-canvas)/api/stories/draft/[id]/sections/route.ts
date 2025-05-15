import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/withAuth";
import { z } from "zod";
import { getDraftSections } from "@/lib/actions/draft/get-draft-sections-by-id";
import { getDraftStoryByStoryId } from "@/lib/dal/draft";

const querySchema = z.object({
  orderBy: z
    .enum(["createdAt", "updatedAt", "order", "type", "name"])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/draft/stories/:id/sections
 *
 * Requires authentication via Bearer token in the Authorization header.
 *
 * Returns all the current draft sections of a story.
 * The story is identified by ID because slugs can change between versions.
 *
 * @header Authorization - Bearer JWT token (required)
 * @queryParam orderBy - string (optional) - Field to order by
 * @queryParam order - string (optional) - Order direction (asc/desc)
 *
 * @param request - The request object.
 * @param params - The route parameters including the story ID.
 * @returns A list of draft sections or an error.
 * @throws 400 - Invalid story ID or query
 * @throws 401 - Unauthorized
 * @throws 404 - Story not found
 * @throws 500 - Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth
  const authHeader = request.headers.get("authorization");
  try {
    if (authHeader) {
      const user = await verifyRequestToken(authHeader);
      if (!user) throw new Error("Invalid token");
    } else {
      const user = await requireAuth();
      if (user instanceof NextResponse) throw new Error("Unauthorized");
    }
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate story ID
  const { id } = await params;
  const storyId = Number(id);
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams;
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

  // Fetch data
  try {
    const story = await getDraftStoryByStoryId(storyId);
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const sections = await getDraftSections({
      storyId,
      orderBy,
      order,
    });

    if ("error" in sections) {
      return NextResponse.json({ message: sections.error }, { status: 500 });
    }

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

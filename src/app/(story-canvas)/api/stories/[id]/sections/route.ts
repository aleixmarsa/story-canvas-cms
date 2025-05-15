import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/withAuth";
import { z } from "zod";
import { getSections } from "@/lib/actions/sections/get-sections";
import { getStory } from "@/lib/dal/stories";

const querySchema = z.object({
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/stories/:id/sections
 *
 * Requires authentication via Bearer token in the Authorization header.
 *
 * Fetches all sections (both current draft and published versions) for a given story ID.
 * Allows optional ordering via `orderBy` and `order` query parameters.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.x
 *
 * @header Authorization - Bearer JWT token (required)
 * @queryParam orderBy - string (optional) - Field to order by ("createdAt", "updatedAt")
 * @queryParam order - string (optional) - Order direction ("asc" or "desc")
 *
 * @returns A JSON array of sections or an error message.
 * @throws 400 - Invalid story ID or query params
 * @throws 401 - Unauthorized
 * @throws 500 - Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check for authorization header
  const authHeader = request.headers.get("authorization");

  try {
    if (authHeader) {
      const user = await verifyRequestToken(authHeader ?? "");
      if (!user) throw new Error("Invalid token");
    } else {
      const user = await requireAuth();
      if (user instanceof NextResponse) throw new Error("Unauthorized");
    }
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Validate story ID
  const storyId = parseInt(id);
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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

  try {
    const story = await getStory({
      storyId,
    });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const sections = await getSections({
      storyId,
      orderBy,
      order,
    });

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sections", detail: error },
      { status: 500 }
    );
  }
}

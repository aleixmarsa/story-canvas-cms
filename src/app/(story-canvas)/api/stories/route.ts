import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAllStoriesMetadata } from "@/lib/actions/stories/get-all-stories";
import { verifyRequestToken } from "@/lib/auth/session";

const querySchema = z.object({
  includeSections: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/stories
 *
 * Requires authentication via Bearer token in the Authorization header.
 *
 * Returns all stories with their current draft and published version metadata.
 * Optionally, includes sections if `?includeSections=true` is set.
 *
 * @header Authorization - Bearer JWT token (required)
 * @queryParam includeSections - boolean (optional) - Include draft and published sections
 * @queryParam orderBy - string (optional) - Order by field ("createdAt" or "updatedAt")
 * @queryParam order - string (optional) - Order direction ("asc" or "desc")
 *
 * @returns List of stories
 * @throws 400 - Invalid query
 * @throws 401 - Unauthorized
 * @throws 500 - Internal server error
 */
export async function GET(request: NextRequest) {
  // Check for authorization header
  const authHeader = request.headers.get("authorization");
  try {
    const user = await verifyRequestToken(authHeader ?? "");
    if (!user) throw new Error("Invalid token");
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Parse query parameters
  const searchParams = request.nextUrl.searchParams;

  const rawParams = {
    includeSections: searchParams.get("includeSections") ?? undefined,
    orderBy: searchParams.get("orderBy") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  };

  // Validate query parameters
  const parseResult = querySchema.safeParse(rawParams);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        errors: parseResult.error.format(),
      },
      { status: 400 }
    );
  }

  // Extract parsed data
  const { includeSections, orderBy, order } = parseResult.data;

  // Fetch stories from the database
  try {
    const stories = await getAllStoriesMetadata({
      includeSections,
      orderBy,
      order,
    });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAllStories } from "@/lib/dal/stories";

const querySchema = z.object({
  includeSections: z.coerce.boolean().optional(),
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/stories
 * Returns all stories with their current draft and published version metadata.
 * Optionally, includes sections if `?includeSections=true` is set.
 *
 * @queryParam includeSections - boolean (optional)
 * @returns List of stories
 * @throws 400 - Invalid query
 * @throws 500 - Internal server error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const parseResult = querySchema.safeParse({
    includeSections: searchParams.get("includeSections"),
    orderBy: searchParams.get("orderBy"),
    order: searchParams.get("order"),
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

  const { includeSections, orderBy, order } = parseResult.data;

  try {
    const stories = await getAllStories({
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

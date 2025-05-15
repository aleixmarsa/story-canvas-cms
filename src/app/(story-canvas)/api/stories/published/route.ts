import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPublishedStories } from "@/lib/actions/published/get-published-stories";

const querySchema = z.object({
  includeSections: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

/**
 * GET /api/published/stories
 *
 * Returns all published stories with their published version metadata.
 * Optionally, includes sections if `?includeSections=true` is set.
 *
 * @queryParam includeSections - boolean (optional)
 * @queryParam orderBy - string (optional) - "createdAt" | "updatedAt"
 * @queryParam order - string (optional) - "asc" | "desc"
 *
 * @returns List of published stories metadata
 * @throws 400 - Invalid query parameters
 * @throws 500 - Internal server error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const parseResult = querySchema.safeParse({
    includeSections: searchParams.get("includeSections") ?? undefined,
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

  const { includeSections, orderBy, order } = parseResult.data;

  try {
    const result = await getPublishedStories({
      includeSections,
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

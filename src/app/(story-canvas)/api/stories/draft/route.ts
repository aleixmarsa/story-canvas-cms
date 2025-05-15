import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyRequestToken } from "@/lib/auth/session";
import { getCurrentDraftStories } from "@/lib/actions/draft/get-draft-stories";
import { requireAuth } from "@/lib/auth/withAuth";

const querySchema = z.object({
  includeSections: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
/**
 * GET /api/stories/draft
 *
 * Requires authentication via Bearer token in the Authorization header.
 *
 * Fetches all draft stories metadata.
 *
 * @header Authorization - Bearer JWT token (required)
 * @queryParam orderBy - string (optional) - Field to order by ("createdAt", "updatedAt")
 * @queryParam order - string (optional) - Order direction ("asc" or "desc")
 *
 * @returns The list of draft stories with their metadata.
 * @throws 400 - Invalid query parameters
 * @throws 401 - Unauthorized
 * @throws 500 - Internal server error
 */
export async function GET(request: NextRequest) {
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

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    includeSections: searchParams.get("includeSections") ?? undefined,
    orderBy: searchParams.get("orderBy") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  };

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

  const { orderBy, order, includeSections } = parseResult.data;

  // Fetch draft stories
  try {
    const result = await getCurrentDraftStories({
      orderBy,
      order,
      includeSections,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

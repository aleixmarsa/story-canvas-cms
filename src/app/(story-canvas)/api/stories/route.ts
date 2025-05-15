import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAllStoriesMetadata } from "@/lib/actions/stories/get-all-stories";
import { verifyRequestToken } from "@/lib/auth/session";
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
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get all stories
 *     description: >
 *       Requires authentication. You can authenticate either via:
 *         - Bearer token in the `Authorization` header
 *         - Active session cookie (for CMS dashboard users)
 *
 *       Note: Swagger UI sends session cookies automatically if present.
 *       To simulate an unauthenticated request, use an incognito window or log out first.
 *     tags:
 *       - Stories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeSections
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Whether to include section metadata
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *         required: false
 *         description: Field to order by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Sorting direction
 *     responses:
 *       200:
 *         description: List of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   currentDraft:
 *                     type: object
 *                     nullable: true
 *                   publishedVersion:
 *                     type: object
 *                     nullable: true
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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

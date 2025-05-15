import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyRequestToken } from "@/lib/auth/session";
import { getCurrentDraftStories } from "@/lib/actions/draft/get-draft-stories";
import { requireAuth } from "@/lib/auth/withAuth";

/**
 * @swagger
 * /api/stories/draft:
 *   get:
 *     summary: Get all draft stories
 *     description: >
 *       Requires authentication. You can authenticate either via:
 *         - Bearer token in the `Authorization` header
 *         - Active session cookie (for CMS dashboard users)
 *
 *       Note: Swagger UI sends session cookies automatically if present.
 *       To simulate an unauthenticated request, use an incognito window or log out first.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: query
 *         name: includeSections
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Whether to include draft and published sections
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *         description: Field to order by
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of draft stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       currentDraftId:
 *                         type: integer
 *                         example: 10
 *                       currentDraft:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           createdBy:
 *                             type: string
 *                           description:
 *                             type: string
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized (missing or invalid credentials)
 *       500:
 *         description: Internal server error
 */

const querySchema = z.object({
  includeSections: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

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

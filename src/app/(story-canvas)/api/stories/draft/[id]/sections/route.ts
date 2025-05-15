import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/withAuth";
import { z } from "zod";
import { getDraftSections } from "@/lib/actions/draft/get-draft-sections-by-id";
import { getDraftStoryByStoryId } from "@/lib/dal/draft";

/**
 * @swagger
 * /api/stories/draft/{id}/sections:
 *   get:
 *     summary: Get draft sections of a story
 *     description: >
 *       Requires authentication. You can authenticate either via:
 *         - Bearer token in the `Authorization` header
 *         - Active session cookie (for CMS dashboard users)
 *
 *       Note: Swagger UI sends session cookies automatically if present.
 *       To simulate an unauthenticated request, use an incognito window or log out first.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the story
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, order, type, name]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of draft sections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 42
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       currentDraftId:
 *                         type: integer
 *                       currentDraft:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                           order:
 *                             type: number
 *                           content:
 *                             type: object
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           slug:
 *                             type: string
 *                           createdBy:
 *                             type: string
 *       400:
 *         description: Invalid story ID or query parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Story not found
 *       500:
 *         description: Internal server error
 */

const querySchema = z.object({
  orderBy: z
    .enum(["createdAt", "updatedAt", "order", "type", "name"])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

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

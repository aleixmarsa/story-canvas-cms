import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/withAuth";
import { z } from "zod";
import { getSections } from "@/lib/actions/sections/get-sections";
import { getStory } from "@/lib/dal/stories";

/**
 * @swagger
 * /api/stories/{id}/sections:
 *   get:
 *     summary: Get all sections for a story
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
 *           enum: [createdAt, updatedAt]
 *         description: Field to order by
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order direction
 *     responses:
 *       200:
 *         description: List of sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 example:
 *                   id: 42
 *                   currentDraft: { id: 1, name: "Hero Section" }
 *                   publishedVersion: { id: 2, name: "Hero Section - Published" }
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
  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

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

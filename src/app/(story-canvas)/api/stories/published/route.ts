import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPublishedStories } from "@/lib/actions/published/get-published-stories";

/**
 * @swagger
 * /api/stories/published:
 *   get:
 *     summary: Get all published stories
 *     description: >
 *       Returns all published stories with their published version metadata.
 *       Optionally includes sections if `?includeSections=true` is set.
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: query
 *         name: includeSections
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Include draft and published sections
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
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
 *         description: List of published stories
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
 *                       publicSlug:
 *                         type: string
 *                         example: "my-story"
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       publishedVersion:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *       400:
 *         description: Invalid query parameters
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
  const searchParams = request.nextUrl.searchParams;
  // Parse query parameters
  const parseResult = querySchema.safeParse({
    includeSections: searchParams.get("includeSections") ?? undefined,
    orderBy: searchParams.get("orderBy") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  });

  // Validate query parameters
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

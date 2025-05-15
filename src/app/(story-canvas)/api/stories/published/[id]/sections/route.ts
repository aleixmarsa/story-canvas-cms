import { fetchPublishedSectionsByStoryId } from "@/lib/actions/published/get-published-sections-by-id";
import { getStory } from "@/lib/dal/stories";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/stories/published/{id}/sections:
 *   get:
 *     summary: Get published sections of a story
 *     description: >
 *       Public endpoint that returns all the published sections of a story by ID.
 *     tags:
 *       - Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the story
 *         schema:
 *           type: integer
 *           example: 123
 *       - in: query
 *         name: orderBy
 *         required: false
 *         description: Field to order by
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, order, type, name]
 *       - in: query
 *         name: order
 *         required: false
 *         description: Order direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of published sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Intro Section"
 *                   type:
 *                     type: string
 *                     example: "paragraph"
 *                   order:
 *                     type: integer
 *                     example: 1
 *                   content:
 *                     type: object
 *                     example:
 *                       body: "This is the content of the section"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-13T12:00:00Z"
 *                   slug:
 *                     type: string
 *                     example: "intro-section"
 *                   createdBy:
 *                     type: string
 *                     example: "user123"
 *       400:
 *         description: Invalid ID or query parameters
 *       404:
 *         description: Story not found or not published
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = parseInt(id);
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;
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
    const story = await getStory({ storyId });
    if (!story || !story.publishedVersionId) {
      return NextResponse.json({ error: "Story Not Found" }, { status: 404 });
    }

    const result = await fetchPublishedSectionsByStoryId({
      storyId,
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

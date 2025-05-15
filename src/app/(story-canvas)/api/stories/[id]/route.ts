import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { getStoryMetadata } from "@/lib/actions/stories/get-story";
import { requireAuth } from "@/lib/auth/withAuth";
import { z } from "zod";

const querySchema = z.object({
  includeSections: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

/**
 * @swagger
 * /api/stories/{id}:
 *   get:
 *     summary: Get a single story by ID
 *     description: >
 *       Requires authentication. You can authenticate either via:
 *         - Bearer token in the `Authorization` header
 *         - Active session cookie (for CMS dashboard users)
 *
 *       Note: Swagger UI sends session cookies automatically if present.
 *       To simulate an unauthenticated request, use an incognito window or log out first.
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the story
 *       - in: query
 *         name: includeSections
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to include draft and published sections
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Story data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: 123
 *                 currentDraft: { id: 1, title: "My Draft" }
 *                 publishedVersion: { id: 2, title: "Published Title" }
 *       400:
 *         description: Invalid story ID or query parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Story not found
 *       500:
 *         description: Internal server error
 */
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
    includeSections: searchParams.get("includeSections") ?? undefined,
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

  const { includeSections } = parseResult.data;

  // Fetch story from the database
  try {
    const story = await getStoryMetadata({
      storyId,
      includeSections,
    });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

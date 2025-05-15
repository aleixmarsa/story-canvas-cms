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
 * GET /api/stories/:id
 *
 * Requires authentication via Bearer token in the Authorization header.
 *
 * Fetches a single story metadata by ID with its current draft, published version, all versions,
 * and optionally its sections (if `?includeSections=true`).
 *
 * @param req - The request object.
 * @param params - The parameters object containing the story ID.
 *
 * @header Authorization - Bearer JWT token (required)
 * @queryParam includeSections - boolean (optional) - Include draft and published sections
 *
 * @returns The story with current draft, published version, versions and optionally sections.
 * @throws 400 - Invalid story ID or query params
 * @throws 401 - Unauthorized
 * @throws 404 - Story not found
 * @throws 500 - Internal server error
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

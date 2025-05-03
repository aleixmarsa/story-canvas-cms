/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";

import { getPublishedStoryByPublicSlug } from "@/lib/dal/published";
import { fetchPublishedSections } from "@/lib/actions/published/get-published-sections-by-slug";

jest.mock("@/lib/dal/published", () => ({
  getPublishedStoryByPublicSlug: jest.fn(),
}));

jest.mock("@/lib/actions/published/get-published-sections-by-slug", () => ({
  fetchPublishedSections: jest.fn(),
}));

describe("GET /api/published/stories/:slug/sections", () => {
  const req = new NextRequest("http://localhost");

  it("returns 404 if story is not found", async () => {
    (getPublishedStoryByPublicSlug as jest.Mock).mockResolvedValue(null);

    const res = await GET(req, {
      params: Promise.resolve({ slug: "non-existent" }),
    });

    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.error).toBe("Story Not Found");
  });

  it("returns 200 with published sections", async () => {
    (getPublishedStoryByPublicSlug as jest.Mock).mockResolvedValue({
      id: 1,
      publishedVersion: { title: "Title" },
    });

    const mockSections = [
      {
        id: 1,
        name: "Section A",
        type: "text",
        order: 0,
        content: {},
      },
    ];

    (fetchPublishedSections as jest.Mock).mockResolvedValue(mockSections);

    const res = await GET(req, {
      params: Promise.resolve({ slug: "story-slug" }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(mockSections);
  });

  it("returns 500 on unexpected error", async () => {
    (getPublishedStoryByPublicSlug as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const res = await GET(req, {
      params: Promise.resolve({ slug: "story-slug" }),
    });

    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
    expect(json.error).toBeDefined();
  });
});

/**
 * @jest-environment node
 */
import { GET } from "../route";
import { createRequest } from "node-mocks-http";
import { NextRequest } from "next/server";
import { getStory } from "@/lib/dal/stories";
import { fetchPublishedSectionsByStoryId } from "@/lib/actions/published/get-published-sections-by-id";

jest.mock("@/lib/dal/stories", () => ({
  getStory: jest.fn(),
}));

jest.mock("@/lib/actions/published/get-published-sections-by-id", () => ({
  fetchPublishedSectionsByStoryId: jest.fn(),
}));

function createMockRequest({ url }: { url: string }): NextRequest {
  const nodeReq = createRequest({
    method: "GET",
    url,
  });
  return new NextRequest(nodeReq);
}

describe("GET /api/stories/published/:id/sections", () => {
  const mockParams = Promise.resolve({ id: "123" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if ID is invalid", async () => {
    const req = createMockRequest({
      url: "http://localhost/api/stories/published/not-a-number/sections",
    });
    const res = await GET(req, {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid ID");
  });

  it("returns 400 if query params are invalid", async () => {
    const req = createMockRequest({
      url: "http://localhost/api/stories/published/123/sections?orderBy=invalid&order=asc",
    });

    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid query parameters");
    expect(json.errors).toHaveProperty("orderBy");
  });

  it("returns 404 if story not found", async () => {
    (getStory as jest.Mock).mockResolvedValue(null);

    const req = createMockRequest({
      url: "http://localhost/api/stories/published/123/sections",
    });
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Story Not Found");
  });

  it("returns 200 and sections if valid", async () => {
    (getStory as jest.Mock).mockResolvedValue({
      id: 123,
      publishedVersionId: 456,
    });

    const mockSections = { success: true, sections: [{ id: 1 }, { id: 2 }] };
    (fetchPublishedSectionsByStoryId as jest.Mock).mockResolvedValue(
      mockSections
    );

    const req = createMockRequest({
      url: "http://localhost/api/stories/published/123/sections?orderBy=createdAt&order=desc",
    });

    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockSections);
  });

  it("returns 500 if fetchPublishedSections throws", async () => {
    (getStory as jest.Mock).mockResolvedValue({
      id: 123,
      publishedVersionId: 456,
    });

    (fetchPublishedSectionsByStoryId as jest.Mock).mockRejectedValue(
      new Error("boom")
    );

    const req = createMockRequest({
      url: "http://localhost/api/stories/published/123/sections",
    });
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

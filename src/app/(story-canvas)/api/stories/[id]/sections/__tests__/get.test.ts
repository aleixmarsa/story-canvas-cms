/**
 * @jest-environment node
 */
import { GET } from "../route";
import { createRequest } from "node-mocks-http";
import { NextRequest } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/withAuth";
import { getSectionsByStoryId } from "@/lib/dal/sections";
import { getStory } from "@/lib/dal/stories";

jest.mock("@/lib/auth/session", () => ({
  verifyRequestToken: jest.fn(),
}));

jest.mock("@/lib/dal/sections", () => ({
  getSectionsByStoryId: jest.fn(),
}));

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("@/lib/dal/stories", () => ({
  getStory: jest.fn(),
}));

function createMockNextRequest({
  url,
  headers = {},
}: {
  url: string;
  headers?: Record<string, string>;
}): NextRequest {
  const nodeReq = createRequest({
    method: "GET",
    url,
    headers,
  });

  return new NextRequest(nodeReq);
}

describe("GET /api/stories/:id/sections", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuth as jest.Mock).mockResolvedValue({ userId: "fallback" });
  });

  it("returns 200 and sections when request is valid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockResolvedValue({ id: 1 });
    const mockSections = [{ id: 1 }, { id: 2 }];
    (getSectionsByStoryId as jest.Mock).mockResolvedValue(mockSections);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/1/sections?orderBy=createdAt&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockSections);
  });

  it("returns 401 if token is missing", async () => {
    (verifyRequestToken as jest.Mock).mockImplementation(() => {
      throw new Error("Missing token");
    });
    (requireAuth as jest.Mock).mockResolvedValue(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );
    const req = createMockNextRequest({
      url: "http://localhost/api/stories/1/sections",
    });

    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 if story ID is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/invalid/sections",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "invalid" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Invalid ID" });
  });

  it("returns 400 if query params are invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/1/sections?orderBy=wrong",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid query parameters");
    expect(json.errors).toHaveProperty("orderBy");
  });

  it("returns 404 if story does not exist", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockResolvedValue(null);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/99/sections",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "99" }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "Story not found" });
  });

  it("returns 500 on internal error", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockResolvedValue({ id: 1 });
    (getSectionsByStoryId as jest.Mock).mockRejectedValue(new Error("fail"));

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/1/sections",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch sections");
  });
});

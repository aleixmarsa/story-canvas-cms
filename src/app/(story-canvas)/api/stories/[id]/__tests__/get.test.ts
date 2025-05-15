/**
 * @jest-environment node
 */
import { GET } from "../route";
import { createRequest } from "node-mocks-http";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/withAuth";
import { getStory } from "@/lib/dal/stories";

jest.mock("@/lib/auth/session", () => ({
  verifyRequestToken: jest.fn(),
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
    headers: {
      ...headers,
      authorization: headers.Authorization ?? headers.authorization,
    },
  });

  return new NextRequest(nodeReq);
}

describe("GET /api/stories/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuth as jest.Mock).mockResolvedValue({ userId: "fallback" });
  });

  it("returns 200 when session is valid (no Authorization header)", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue(undefined);
    (requireAuth as jest.Mock).mockResolvedValue({ userId: "2" });

    const mockStory = {
      id: 124,
      currentDraft: { id: 11 },
      publishedVersion: { id: 21 },
    };
    (getStory as jest.Mock).mockResolvedValue(mockStory);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/124",
    });

    const res = await GET(req, { params: Promise.resolve({ id: "124" }) });
    const json = await res.json();

    expect(verifyRequestToken).not.toHaveBeenCalled();
    expect(requireAuth).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(json).toEqual(mockStory);
  });

  it("returns 401 if no authHeader and requireAuth fails", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123",
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(verifyRequestToken).not.toHaveBeenCalled();
    expect(requireAuth).toHaveBeenCalled();
    expect(res.status).toBe(401);
    expect(json).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 if ID is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/not-a-number",
      headers: { authorization: "Bearer token" },
    });

    const res = await GET(req, {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Invalid ID" });
  });

  it("returns 404 if story not found", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockResolvedValue(null);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/999",
      headers: { authorization: "Bearer token" },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "999" }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "Story not found" });
  });

  it("returns 500 on server error", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockRejectedValue(new Error("fail"));

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123",
      headers: { authorization: "Bearer token" },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

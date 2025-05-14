/**
 * @jest-environment node
 */
import { GET } from "../route";
import { createRequest } from "node-mocks-http";
import { NextRequest } from "next/server";
import { verifyRequestToken } from "@/lib/auth/session";
import { getStory } from "@/lib/dal/stories";

jest.mock("@/lib/auth/session", () => ({
  verifyRequestToken: jest.fn(),
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

describe("GET /api/stories/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and story when token and id are valid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const mockStory = {
      id: 123,
      currentDraft: { id: 10 },
      publishedVersion: { id: 20 },
    };

    (getStory as jest.Mock).mockResolvedValue(mockStory);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockStory);
  });

  it("returns 401 if token is missing", async () => {
    (verifyRequestToken as jest.Mock).mockImplementation(() => {
      throw new Error("Missing token");
    });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123",
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 if id is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/not-number",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, {
      params: Promise.resolve({ id: "not-a-number" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Invalid ID" });
  });

  it("returns 400 if includeSections is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123?includeSections=notvalid",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid query parameters");
    expect(json.errors).toHaveProperty("includeSections");
  });

  it("returns 404 if story not found", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockResolvedValue(null);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/999",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "999" }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "Story not found" });
  });

  it("returns 500 on server error", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (getStory as jest.Mock).mockRejectedValue(
      new Error("Something went wrong")
    );

    const req = createMockNextRequest({
      url: "http://localhost/api/stories/123",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(req, { params: Promise.resolve({ id: "123" }) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

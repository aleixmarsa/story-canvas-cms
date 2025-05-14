/**
 * @jest-environment node
 */
import { GET } from "../route";
import prisma from "@/lib/prisma";
import { verifyRequestToken } from "@/lib/auth/session";
import { createRequest } from "node-mocks-http";
import { NextRequest } from "next/server";

jest.mock("@/lib/auth/session", () => ({
  verifyRequestToken: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findMany: jest.fn(),
    },
  },
}));

export function createMockNextRequest({
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

describe("GET /api/stories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and stories when request is valid", async () => {
    const mockStories = [
      { id: 1, currentDraft: { id: 10 }, publishedVersion: { id: 20 } },
    ];

    (verifyRequestToken as jest.Mock).mockResolvedValue({
      userId: "123",
      email: "user@example.com",
      role: "EDITOR",
    });
    (prisma.story.findMany as jest.Mock).mockResolvedValue(mockStories);

    const req = createMockNextRequest({
      url: "http://localhost/api/stories?includeSections=true&orderBy=createdAt&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockStories);
  });

  it("returns 401 if token is missing", async () => {
    (verifyRequestToken as jest.Mock).mockImplementation(() => {
      throw new Error("Missing token");
    });
    const req = new NextRequest("http://localhost/api/stories");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 if includeSections is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories?includeSections=notvalid&orderBy=createdAt&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid query parameters");
    expect(json.errors).toHaveProperty("includeSections");
  });

  it("returns 400 if orderBy is invalid", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });

    const req = createMockNextRequest({
      url: "http://localhost/api/stories?includeSections=true&orderBy=notvalid&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.errors).toHaveProperty("orderBy");
  });

  it("returns 500 on internal error", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({ userId: "1" });
    (prisma.story.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = createMockNextRequest({
      url: "http://localhost/api/stories?includeSections=true&orderBy=createdAt&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

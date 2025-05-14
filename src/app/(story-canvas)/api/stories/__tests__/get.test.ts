/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import { createRequest } from "node-mocks-http"; // o crea-la manualment
import prisma from "@/lib/prisma";

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

import { verifyRequestToken } from "@/lib/auth/session";

describe("GET /api/stories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns list of stories with valid token", async () => {
    const mockStories = [
      {
        id: 1,
        currentDraft: { id: 10 },
        publishedVersion: { id: 20 },
      },
    ];

    (prisma.story.findMany as jest.Mock).mockResolvedValue(mockStories);
    (verifyRequestToken as jest.Mock).mockResolvedValue({
      userId: "123",
      email: "user@example.com",
      role: "EDITOR",
    });

    const request = createMockNextRequest({
      url: "http://localhost/api/stories?includeSections=true&orderBy=createdAt&order=asc",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockStories);
  });

  it("returns 401 if token is missing or invalid", async () => {
    (verifyRequestToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const request = new NextRequest("http://localhost/api/stories");

    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ message: "Unauthorized" });
  });

  it("handles internal server error", async () => {
    (verifyRequestToken as jest.Mock).mockResolvedValue({
      userId: "123",
      email: "user@example.com",
      role: "EDITOR",
    });

    (prisma.story.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const request = createMockNextRequest({
      url: "http://localhost/api/stories",
      headers: {
        Authorization: "Bearer testtoken",
      },
    });

    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      message: "Internal server error",
      error: {},
    });
  });
});

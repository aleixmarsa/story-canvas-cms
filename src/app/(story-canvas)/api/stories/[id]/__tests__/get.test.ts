/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/auth/session", () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("GET /api/stories/[id]", () => {
  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 if id is invalid", async () => {
    const res = await GET(new NextRequest("http://localhost"), {
      params: Promise.resolve({ id: "abc" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid ID");
  });

  it("returns 404 if story not found", async () => {
    (prisma.story.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Story not found");
  });

  it("returns 200 with story", async () => {
    const mockStory = {
      id: 1,
      title: "Test Story",
      currentDraft: {},
      publishedVersion: {},
      versions: [],
    };

    (prisma.story.findUnique as jest.Mock).mockResolvedValue(mockStory);

    const res = await GET(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockStory);
  });
});

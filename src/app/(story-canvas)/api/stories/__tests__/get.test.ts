/**
 * @jest-environment node
 */
import { GET } from "../route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/auth/session", () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/stories", () => {
  it("returns list of stories", async () => {
    const mockStories = [
      {
        id: 1,
        currentDraft: { id: 10 },
        publishedVersion: { id: 20 },
      },
    ];

    (prisma.story.findMany as jest.Mock).mockResolvedValue(mockStories);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockStories);
  });
  it("handles errors", async () => {
    (prisma.story.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      message: "Internal server error",
      error: {},
    });
  });
});

/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findUnique: jest.fn(),
    },
  },
}));

describe("GET /api/stories/:id/published", () => {
  const mockParams = { id: "1" };

  it("returns 400 for invalid ID", async () => {
    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: { id: "abc" } });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid ID");
  });

  it("returns 404 if story or published version not found", async () => {
    (prisma.story.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Published version not found");
  });

  it("returns 404 if story exists but no published version", async () => {
    (prisma.story.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      publishedVersion: null,
    });

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Published version not found");
  });

  it("returns 200 with published version", async () => {
    const mockPublished = {
      id: 101,
      title: "Published Story",
      content: { blocks: [] },
    };

    (prisma.story.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      publishedVersion: mockPublished,
    });

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockPublished);
  });
});

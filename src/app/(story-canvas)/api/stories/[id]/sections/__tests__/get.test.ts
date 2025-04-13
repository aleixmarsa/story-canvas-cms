/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    section: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/stories/:id/sections", () => {
  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 for invalid story ID", async () => {
    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: Promise.resolve({ id: "abc" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid story ID");
  });

  it("returns 200 with section list", async () => {
    const mockSections = [
      {
        id: 1,
        name: "Section 1",
        currentDraft: {},
        publishedVersion: {},
      },
    ];

    (prisma.section.findMany as jest.Mock).mockResolvedValue(mockSections);

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockSections);
  });

  it("returns 500 if fetch fails", async () => {
    (prisma.section.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch sections");
  });
});

/**
 * @jest-environment node
 */
import { POST } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    sectionVersion: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    section: {
      update: jest.fn(),
    },
  },
}));

describe("POST /api/section-versions/:id/publish", () => {
  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 for invalid version ID", async () => {
    const req = new NextRequest("http://localhost", { method: "POST" });
    const res = await POST(req, { params: Promise.resolve({ id: "abc" }) });

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid section version ID");
  });

  it("returns 404 if section version not found", async () => {
    const req = new NextRequest("http://localhost", { method: "POST" });

    (prisma.sectionVersion.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Section version not found");
  });

  it("returns 200 when version is published and draft created", async () => {
    const req = new NextRequest("http://localhost", { method: "POST" });

    const original = {
      id: 1,
      sectionId: 10,
      name: "Intro",
      type: "PARAGRAPH",
      order: 0,
      content: { body: "Text" },
      createdBy: "user123",
    };

    const publishedVersion = { ...original, status: "published" };
    const draftCopy = { ...original, id: 2, status: "draft" };
    const updatedSection = {
      id: 10,
      publishedVersion,
      currentDraft: draftCopy,
    };

    (prisma.sectionVersion.findUnique as jest.Mock).mockResolvedValue(original);
    (prisma.sectionVersion.update as jest.Mock).mockResolvedValue(
      publishedVersion
    );
    (prisma.sectionVersion.create as jest.Mock).mockResolvedValue(draftCopy);
    (prisma.section.update as jest.Mock).mockResolvedValue(updatedSection);

    const res = await POST(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.publishedVersion).toBeDefined();
    expect(json.currentDraft).toBeDefined();
  });

  it("returns 500 on unexpected error", async () => {
    const req = new NextRequest("http://localhost", { method: "POST" });

    (prisma.sectionVersion.findUnique as jest.Mock).mockRejectedValue(
      new Error("Unexpected DB error")
    );

    const res = await POST(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

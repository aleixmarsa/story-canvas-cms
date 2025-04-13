/**
 * @jest-environment node
 */
import { PATCH } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConflictError } from "@/lib/errors";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    sectionVersion: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    section: {
      findUnique: jest.fn(),
    },
  },
}));

describe("PATCH /api/section-versions/:id", () => {
  const validBody = {
    storyId: 1,
    sectionId: 1,
    name: "Updated section",
    slug: "updated-section",
    type: "PARAGRAPH",
    order: 2,
    content: { body: "New content" },
    comment: "Edited",
  };

  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 for invalid version ID", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid sectionVersion ID");
  });

  it("returns 422 for invalid body", async () => {
    const req = new NextRequest("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    req.json = async () => ({});

    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(422);
  });

  it("returns 409 if slug already exists (ConflictError)", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    req.json = async () => validBody;

    (prisma.sectionVersion.findFirst as jest.Mock).mockRejectedValue(
      new ConflictError()
    );

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.message).toBe("Slug already exists");
  });

  it("returns 200 with updated section", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    req.json = async () => validBody;

    (prisma.sectionVersion.findFirst as jest.Mock).mockResolvedValue(null);

    const mockUpdated = {
      id: 1,
      sectionId: 99,
    };
    const mockSection = {
      id: 99,
      title: "Full section",
      currentDraft: {},
      publishedVersion: {},
    };

    (prisma.sectionVersion.update as jest.Mock).mockResolvedValue(mockUpdated);
    (prisma.section.findUnique as jest.Mock).mockResolvedValue(mockSection);

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(99);
    expect(json.currentDraft).toBeDefined();
    expect(json.publishedVersion).toBeDefined();
  });

  it("returns 409 for Prisma P2002 error", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    req.json = async () => validBody;

    (prisma.sectionVersion.findFirst as jest.Mock).mockResolvedValue(null);

    const prismaError = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        clientVersion: "test",
        code: "P2002",
      }
    );

    (prisma.sectionVersion.update as jest.Mock).mockRejectedValue(prismaError);

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.message).toBe("Slug already exists");
  });

  it("returns 500 for unknown errors", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    req.json = async () => validBody;

    (prisma.sectionVersion.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.sectionVersion.update as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Failed to update section version");
  });
});

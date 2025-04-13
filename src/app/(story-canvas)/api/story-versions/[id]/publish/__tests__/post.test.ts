/**
 * @jest-environment node
 */
import { POST } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    storyVersion: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    story: {
      update: jest.fn(),
    },
  },
}));

describe("POST /api/story-versions/:id/publish", () => {
  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 for invalid version ID", async () => {
    const res = await POST(new NextRequest("http://localhost"), {
      params: Promise.resolve({ id: "abc" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid story version ID");
  });

  it("returns 404 if version not found", async () => {
    (prisma.storyVersion.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Story version not found");
  });

  it("returns 200 with updated story and new draft", async () => {
    const original = {
      id: 1,
      storyId: 123,
      title: "Original Title",
      slug: "original-title",
      description: "Some description",
      theme: null,
      components: null,
      content: {},
      createdBy: "user123",
    };

    const publishedVersion = {
      ...original,
      status: "published",
    };

    const draftCopy = {
      ...original,
      id: 2,
      status: "draft",
      slug: "original-title",
    };

    const updatedStory = {
      id: 123,
      publishedVersion,
      currentDraft: draftCopy,
    };

    (prisma.storyVersion.findUnique as jest.Mock).mockResolvedValue(original);
    (prisma.storyVersion.update as jest.Mock).mockResolvedValue(
      publishedVersion
    );
    (prisma.storyVersion.create as jest.Mock).mockResolvedValue(draftCopy);
    (prisma.story.update as jest.Mock).mockResolvedValue(updatedStory);

    const res = await POST(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.publishedVersion).toBeDefined();
    expect(json.currentDraft).toBeDefined();
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.storyVersion.findUnique as jest.Mock).mockRejectedValue(
      new Error("Unexpected DB error")
    );

    const res = await POST(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

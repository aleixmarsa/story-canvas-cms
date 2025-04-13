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
      create: jest.fn(),
    },
    story: {
      update: jest.fn(),
    },
  },
}));

describe("POST /api/story-versions/:id/duplicate", () => {
  const mockParams = Promise.resolve({ id: "1" });

  it("returns 400 for invalid ID", async () => {
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

  it("returns 200 with duplicated version and updated story", async () => {
    const originalVersion = {
      id: 1,
      storyId: 123,
      title: "My Story",
      slug: "my-story",
      description: "Some story",
      theme: null,
      components: null,
      content: {},
      createdBy: "user123",
    };

    const newDraft = {
      ...originalVersion,
      slug: "my-story-copy-1234567890",
      status: "draft",
      comment: "Duplicate of version 1",
    };

    const updatedStory = {
      id: 123,
      currentDraft: newDraft,
      publishedVersion: {},
    };

    (prisma.storyVersion.findUnique as jest.Mock).mockResolvedValue(
      originalVersion
    );
    (prisma.storyVersion.create as jest.Mock).mockResolvedValue(newDraft);
    (prisma.story.update as jest.Mock).mockResolvedValue(updatedStory);

    const res = await POST(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.currentDraft).toBeDefined();
    expect(json.currentDraft.slug).toContain("copy");
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.storyVersion.findUnique as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    const res = await POST(new NextRequest("http://localhost"), {
      params: mockParams,
    });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

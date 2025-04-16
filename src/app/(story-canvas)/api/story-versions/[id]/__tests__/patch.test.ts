/**
 * @jest-environment node
 */
import { PATCH } from "../route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConflictError } from "@/lib/errors";

import { requireAuth } from "@/lib/auth/withAuth";

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn().mockResolvedValue({ id: "mock-user-id" }),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    storyVersion: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("PATCH /api/story-versions/:id", () => {
  const validBody = {
    title: "Updated Story",
    slug: "updated-story",
    description: "Updated description",
    theme: null,
    components: null,
    content: {},
    createdBy: "user123",
    storyId: 1,
  };

  const mockParams = Promise.resolve({ id: "1" });

  const makeRequest = (body: unknown) => {
    const req = new NextRequest("http://localhost", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    req.json = async () => body;
    return req;
  };

  it("returns 401 if not authenticated", async () => {
    (requireAuth as jest.Mock).mockResolvedValueOnce(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );

    const req = makeRequest(validBody);
    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid version ID", async () => {
    const req = makeRequest(validBody);
    const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid storyVersion ID");
  });

  it("returns 422 for invalid body", async () => {
    const req = makeRequest({});
    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(422);
  });

  it("returns 409 if slug already exists (ConflictError)", async () => {
    const req = makeRequest(validBody);

    (prisma.storyVersion.findFirst as jest.Mock).mockResolvedValue(
      new ConflictError()
    );

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.message).toBe("Slug already exists");
  });

  it("returns 409 on Prisma P2002 error", async () => {
    const req = makeRequest(validBody);

    (prisma.storyVersion.findFirst as jest.Mock).mockResolvedValue(null);

    const prismaError = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        clientVersion: "test",
        code: "P2002",
      }
    );

    (prisma.storyVersion.update as jest.Mock).mockRejectedValue(prismaError);

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.message).toBe("Slug already exists for this status");
  });

  it("returns 200 with updated version", async () => {
    const req = makeRequest(validBody);

    const mockUpdated = {
      id: 1,
      ...validBody,
    };

    (prisma.storyVersion.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.storyVersion.update as jest.Mock).mockResolvedValue(mockUpdated);

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockUpdated);
  });

  it("returns 500 on unexpected error", async () => {
    const req = makeRequest(validBody);

    (prisma.storyVersion.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.storyVersion.update as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

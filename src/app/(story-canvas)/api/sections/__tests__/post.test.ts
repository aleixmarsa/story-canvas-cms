/**
 * @jest-environment node
 */
import { POST } from "../route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/withAuth";

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn().mockResolvedValue({ id: "mock-user-id" }),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
  },
}));

describe("POST /api/sections", () => {
  const validBody = {
    storyId: 1,
    name: "My Section",
    type: "TITLE",
    order: 0,
    content: { text: "Intro" },
    createdBy: "user123",
  };

  it("returns 401 if not authenticated", async () => {
    (requireAuth as jest.Mock).mockResolvedValueOnce(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );

    const req = new NextRequest("http://localhost", { method: "POST" });
    req.json = async () => validBody;

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 422 when body is invalid", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({}),
    });
    req.json = async () => ({});

    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("returns 201 and section with draft", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    req.json = async () => validBody;

    const mockResult = {
      id: 99,
      currentDraft: {
        id: 123,
        name: "My Section",
      },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return callback({
        section: {
          create: jest.fn().mockResolvedValue({ id: 99 }),
          update: jest.fn().mockResolvedValue(mockResult),
        },
        sectionVersion: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 123 }),
        },
      });
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.currentDraft).toBeDefined();
  });

  it("returns 409 if slug already exists", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    req.json = async () => validBody;

    (prisma.$transaction as jest.Mock).mockRejectedValue(new ConflictError());

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.message).toBe("Slug already exists");
  });

  it("returns 500 on unknown errors", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    req.json = async () => validBody;

    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error("DB exploded")
    );

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});

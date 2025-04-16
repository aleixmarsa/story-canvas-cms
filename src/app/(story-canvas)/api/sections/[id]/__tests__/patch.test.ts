/**
 * @jest-environment node
 */
import { PATCH } from "../route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/withAuth";

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn().mockResolvedValue({ id: "mock-user-id" }),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    section: {
      update: jest.fn(),
    },
  },
}));

describe("PATCH /api/sections/:id", () => {
  const validBody = {
    lastEditedBy: "user123",
    lockedBy: null,
  };

  const mockParams = Promise.resolve({ id: "1" });

  it("returns 401 if not authenticated", async () => {
    (requireAuth as jest.Mock).mockResolvedValueOnce(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );

    const req = new NextRequest("http://localhost", { method: "PATCH" });
    req.json = async () => validBody;

    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 400 if section ID is invalid", async () => {
    const req = new NextRequest("http://localhost", { method: "PATCH" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid section ID");
  });

  it("returns 200 with updated section", async () => {
    const req = new NextRequest("http://localhost", {
      method: "PATCH",
      body: JSON.stringify(validBody),
    });
    req.json = async () => validBody;

    const mockUpdated = {
      id: 1,
      lastEditedBy: "user123",
      lockedBy: null,
    };

    (prisma.section.update as jest.Mock).mockResolvedValue(mockUpdated);

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockUpdated);
  });

  it("returns 500 on error", async () => {
    const req = new NextRequest("http://localhost", {
      method: "PATCH",
      body: JSON.stringify(validBody),
    });
    req.json = async () => validBody;

    (prisma.section.update as jest.Mock).mockRejectedValue(
      new Error("Unexpected DB error")
    );

    const res = await PATCH(req, { params: mockParams });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Failed to update section");
  });
});

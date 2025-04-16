/**
 * @jest-environment node
 */
import { PATCH } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn().mockResolvedValue({ id: "mock-user-id" }),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("PATCH /api/stories/[id]", () => {
  const mockParams = { id: "1" };
  describe("PATCH", () => {
    const validBody = {
      publicSlug: "my-public-slug",
      lastEditedBy: "user123",
      lockedBy: null,
    };

    const makeRequest = (body: unknown) => {
      const req = new NextRequest("http://localhost", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      req.json = async () => body;
      return req;
    };

    it("returns 400 for invalid story ID", async () => {
      const req = makeRequest(validBody);

      const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.message).toBe("Invalid story ID");
    });

    it("returns 200 with updated story", async () => {
      const req = makeRequest(validBody);

      const mockUpdated = {
        id: 1,
        publicSlug: "my-public-slug",
        lastEditedBy: "user123",
        lockedBy: null,
      };

      (prisma.story.update as jest.Mock).mockResolvedValue(mockUpdated);

      const res = await PATCH(req, { params: Promise.resolve(mockParams) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(mockUpdated);
    });

    it("returns 409 on Prisma slug conflict", async () => {
      const req = makeRequest(validBody);

      const prismaError = new PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          clientVersion: "test",
          code: "P2002",
        }
      );

      (prisma.story.update as jest.Mock).mockRejectedValue(prismaError);

      const res = await PATCH(req, { params: Promise.resolve(mockParams) });
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.message).toBe("Slug already exists");
    });

    it("returns 500 on unknown errors", async () => {
      const req = makeRequest(validBody);

      (prisma.story.update as jest.Mock).mockRejectedValue(
        new Error("DB exploded")
      );

      const res = await PATCH(req, { params: Promise.resolve(mockParams) });
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.message).toBe("Internal server error");
    });
  });
});

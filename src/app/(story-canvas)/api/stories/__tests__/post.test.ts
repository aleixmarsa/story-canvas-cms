/**
 * @jest-environment node
 */
import { POST } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConflictError } from "@/lib/errors";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    story: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("/api/stories", () => {
  const validBody = {
    title: "New Story",
    slug: "new-story",
    description: "A great story",
    theme: null,
    components: null,
    content: null,
    createdBy: "user123",
  };

  describe("POST", () => {
    it("returns 422 if input is invalid", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({}),
      });
      req.json = async () => ({});

      const res = await POST(req);
      expect(res.status).toBe(422);
    });

    it("returns 201 on successful creation", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      const mockResult = {
        id: 1,
        currentDraft: { id: 2, slug: "new-story" },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          story: {
            create: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue(mockResult),
          },
          storyVersion: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 2 }),
          },
        });
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.currentDraft).toBeDefined();
    });

    it("returns 409 if slug already exists (conflict)", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new ConflictError("Slug already exists")
      );

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.message).toBe("Slug already exists");
    });

    it("returns 409 if Prisma P2002", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      const prismaError = new PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          clientVersion: "test",
          code: "P2002",
        }
      );

      (prisma.$transaction as jest.Mock).mockRejectedValue(prismaError);

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.message).toBe("Slug already exists");
    });

    it("returns 500 on unexpected error", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error("Unknown DB error")
      );

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.message).toBe("Internal server error");
    });
  });
});

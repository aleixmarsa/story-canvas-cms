/**
 * @jest-environment node
 */
import { POST } from "../route";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

describe("/api/signup", () => {
  const validBody = {
    email: "admin@example.com",
    password: "securepass123",
    confirmPassword: "securepass123",
  };

  describe("POST", () => {
    it("returns 400 if input is invalid", async () => {
      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({}),
      });
      req.json = async () => ({});

      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("returns 403 if user already exists", async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.error).toBe("User already exists");
    });

    it("returns 201 on successful creation", async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(0);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-1",
        email: validBody.email,
        role: "ADMIN",
      });

      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.user).toEqual({ id: "user-1", email: validBody.email });
    });

    it("returns 500 on unknown error", async () => {
      (prisma.user.count as jest.Mock).mockRejectedValue(
        new Error("Unexpected error")
      );

      const req = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      req.json = async () => validBody;

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Internal server error");
    });
  });
});

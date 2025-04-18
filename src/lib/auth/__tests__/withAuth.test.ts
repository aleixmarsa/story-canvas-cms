/**
 * @jest-environment node
 */
import { requireAuth, requireAdmin } from "../withAuth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getSession } from "../session";

jest.mock("../session", () => ({
  getSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const mockGetSession = getSession as jest.Mock;
const mockFindUnique = prisma.user.findUnique as jest.Mock;

describe("requireAuth", () => {
  it("returns 401 if no session", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await requireAuth();
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(401);
  });

  it("returns 401 if user not found", async () => {
    mockGetSession.mockResolvedValue({ userId: "123" });
    mockFindUnique.mockResolvedValue(null);

    const res = await requireAuth();
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(401);
  });

  it("returns user if authenticated", async () => {
    const mockUser = { id: "123", role: Role.EDITOR };
    mockGetSession.mockResolvedValue({ userId: "123" });
    mockFindUnique.mockResolvedValue(mockUser);

    const result = await requireAuth();
    expect(result).toEqual(mockUser);
  });
});

describe("requireAdmin", () => {
  it("returns 403 if user is not admin", async () => {
    const mockUser = { id: "123", role: Role.EDITOR };
    mockGetSession.mockResolvedValue({ userId: "123" });
    mockFindUnique.mockResolvedValue(mockUser);

    const res = await requireAdmin();
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(403);
  });

  it("returns user if admin", async () => {
    const mockUser = { id: "123", role: Role.ADMIN };
    mockGetSession.mockResolvedValue({ userId: "123" });
    mockFindUnique.mockResolvedValue(mockUser);

    const result = await requireAdmin();
    expect(result).toEqual(mockUser);
  });

  it("returns 401 if requireAuth fails", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await requireAdmin();
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(401);
  });
});

/**
 * @jest-environment node
 */
import { deleteUser } from "@/lib/actions/users/delete-user";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal/auth";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockVerifySession = verifySession as jest.Mock;
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockDelete = prisma.user.delete as jest.Mock;

describe("deleteUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not admin", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.EDITOR });

    const res = await deleteUser("456");
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error if admin tries to delete themselves", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.ADMIN });

    const res = await deleteUser("123");
    expect(res).toEqual({ error: "You cannot delete your own account." });
  });

  it("returns error if user is not found", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockResolvedValue(null);

    const res = await deleteUser("nonexistent-id");
    expect(res).toEqual({ error: "User not found" });
  });

  it("returns success if user is deleted", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockResolvedValue({ id: "user-to-delete" });

    const res = await deleteUser("user-to-delete");
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "user-to-delete" },
    });
    expect(res).toEqual({ success: true });
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockRejectedValue(new Error("DB crash"));

    const res = await deleteUser("user123");
    expect(res).toEqual({ error: "Internal server error" });
  });
});

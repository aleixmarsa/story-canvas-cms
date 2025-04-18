/**
 * @jest-environment node
 */
import { createUser } from "@/lib/actions/users/create-user";
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
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

const createFormData = (data: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not admin", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.EDITOR });

    const formData = createFormData({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      role: Role.EDITOR,
    });

    const res = await createUser(formData);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error on invalid input", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const formData = createFormData({
      email: "invalid-email",
      password: "short",
      confirmPassword: "mismatch",
      role: Role.EDITOR,
    });

    const res = await createUser(formData);
    expect(res?.error).toBe("Invalid input");
    expect(res?.details).toBeDefined();
  });

  it("returns error if email already exists", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockResolvedValue({ id: "existing-user" });

    const formData = createFormData({
      email: "existing@example.com",
      password: "securepass",
      confirmPassword: "securepass",
      role: "EDITOR",
    });

    const res = await createUser(formData);
    expect(res).toEqual({ error: "Email already in use", type: "email" });
  });

  it("creates user successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockResolvedValue(null);

    mockCreate.mockResolvedValue({
      id: "new-user-id",
      email: "new@example.com",
      role: Role.EDITOR,
    });

    const formData = createFormData({
      email: "new@example.com",
      password: "securepass",
      confirmPassword: "securepass",
      role: "EDITOR",
    });

    const res = await createUser(formData);
    expect(res).toEqual({
      success: true,
      user: {
        id: "new-user-id",
        email: "new@example.com",
        role: Role.EDITOR,
      },
    });
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockFindUnique.mockRejectedValue(new Error("DB exploded"));

    const formData = createFormData({
      email: "error@example.com",
      password: "securepass",
      confirmPassword: "securepass",
      role: "EDITOR",
    });

    const res = await createUser(formData);
    expect(res).toEqual({
      details: "Error: DB exploded",
      error: "Internal server error",
    });
  });
});

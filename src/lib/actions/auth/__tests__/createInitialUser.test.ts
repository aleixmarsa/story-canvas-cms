/**
 * @jest-environment node
 */
import { createInitialUser } from "@/lib/actions/auth/createInitialUser";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

jest.mock("@/lib/auth/session", () => ({
  __esModule: true,
  createSession: jest.fn(),
}));

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

describe("createInitialUser", () => {
  const validFormData = () => {
    const form = new FormData();
    form.set("email", "admin@example.com");
    form.set("password", "securepass123");
    form.set("confirmPassword", "securepass123");
    return form;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if input is invalid", async () => {
    const form = new FormData(); // no camps

    const result = await createInitialUser(form);
    expect(result).toHaveProperty("error", "Invalid input");
  });

  it("returns error if user already exists", async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const result = await createInitialUser(validFormData());
    expect(result).toHaveProperty("error", "Initial user already exists");
  });

  it("creates user and returns success", async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(0);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "admin@example.com",
    });

    const result = await createInitialUser(validFormData());

    expect(result).toEqual({
      success: true,
      user: {
        id: "user-1",
        email: "admin@example.com",
      },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("securepass123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "admin@example.com",
        password: "hashed-password",
        role: Role.ADMIN,
      },
    });
  });

  it("returns internal error if something unexpected happens", async () => {
    (prisma.user.count as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await createInitialUser(validFormData());

    expect(result).toHaveProperty("error", "Internal server error");
  });
});

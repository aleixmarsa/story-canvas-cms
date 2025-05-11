/**
 * @jest-environment node
 */
import { login, logout } from "../login";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants/story-canvas";
import { Role } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@/lib/auth/session", () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("login", () => {
  const mockFormData = (email: string, password: string): FormData => {
    const form = new FormData();
    form.set("email", email);
    form.set("password", password);
    return form;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if input is invalid", async () => {
    const form = mockFormData("invalid", "123");
    const result = await login(form);

    expect(result).toHaveProperty("error", "Invalid input");
    expect(result).toHaveProperty("details");
  });

  it("returns error if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const form = mockFormData("user@example.com", "password123");
    const result = await login(form);

    expect(result).toEqual({ error: "Invalid email or password" });
  });

  it("returns error if password is incorrect", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      password: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const form = mockFormData("user@example.com", "wrongpass");
    const result = await login(form);

    expect(result).toEqual({ error: "Invalid email or password" });
  });

  it("creates session and redirects on valid login", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      role: Role.ADMIN,
      email: "user@example.com",
      password: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const form = mockFormData("user@example.com", "correctpass");
    await login(form);

    expect(createSession).toHaveBeenCalledWith("user-1", Role.ADMIN);
    expect(redirect).toHaveBeenCalledWith(ROUTES.dashboard);
  });
});

describe("logout", () => {
  it("deletes session and redirects", async () => {
    await logout();

    expect(deleteSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(ROUTES.login);
  });
});

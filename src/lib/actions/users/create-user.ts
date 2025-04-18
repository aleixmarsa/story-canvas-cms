"use server";

import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUserSchema } from "@/lib/validation/create-user-schema";
import { verifySession } from "@/lib/dal/auth";

export const createUser = async (formData: FormData) => {
  try {
    const session = await verifySession();

    if (session.role !== Role.ADMIN) {
      return { error: "Unauthorized" };
    }

    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      role: formData.get("role"),
    };

    const parsed = createUserSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        error: "Invalid input",
        details: parsed.error.flatten(),
      };
    }

    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { error: "Email already in use" };
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: Role.EDITOR,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("Failed to create user:", err);
    return { error: "Internal server error" };
  }
};

"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUserSchema } from "@/lib/validation/create-user-schema";
import { createSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const createInitialUser = async (formData: FormData) => {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const parsed = createUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: "Invalid input",
        details: parsed.error.flatten(),
      };
    }

    const { email, password } = parsed.data;

    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      return { error: "Initial user already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    await createSession(user.id, user.role);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error creating initial user:", error);
    return { error: "Internal server error" };
  }
};

"use server";

import bcrypt from "bcryptjs";
import { createInitialUserSchema } from "@/lib/validation/create-initial-user-schema";
import { createSession } from "@/lib/auth/session";
import { userExists, createUser } from "@/lib/dal/users";
import { Role } from "@prisma/client";

export const createInitialUser = async (formData: FormData) => {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const parsed = createInitialUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: "Invalid input",
        details: parsed.error.flatten(),
      };
    }

    const { email, password } = parsed.data;

    if (await userExists()) {
      return { error: "Initial user already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword, Role.ADMIN);

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

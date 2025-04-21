"use server";

import bcrypt from "bcryptjs";
import { createInitialUserSchema } from "@/lib/validation/create-initial-user-schema";
import { createSession } from "@/lib/auth/session";
import { userExists, createUser } from "@/lib/dal/users";
import { Role } from "@prisma/client";

/**
 * Creates the initial ADMIN user in the system.
 *
 * @param formData - A FormData object containing the initial user's email, password, and confirmation.
 *
 * @returns An object containing:
 * - `{ success: true, user: { id, email } }` if creation and session setup succeed.
 * - `{ error: string, details?: any }` if validation fails or the user already exists.
 *
 * @throws Error - If an unexpected error occurs during user creation or session handling.
 */
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

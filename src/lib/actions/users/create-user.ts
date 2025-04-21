"use server";

import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { verifySession } from "@/lib/dal/auth";
import { createUserSchema } from "@/lib/validation/create-user-schema";
import { createUser as createUserInDb, findUserByEmail } from "@/lib/dal/users";

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

    const { email, password, role } = parsed.data;

    const existing = await findUserByEmail(email);
    if (existing) {
      return { error: "Email already in use", type: "email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserInDb(email, hashedPassword, role);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    return {
      error: "Internal server error",
      details: String(err),
    };
  }
};

"use server";

import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/login-schema";
import bcrypt from "bcryptjs";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { findUserByEmail } from "@/lib/dal/users";

/**
 *
 * @param formData - FormData object containing the email and password
 * @param formData.get("email") - The email of the user
 * @param formData.get("password") - The password of the user
 * @param formData.get("confirmPassword") - The password confirmation (not used in this function)
 * @returns {Promise<void>} - A promise that resolves when the login is complete or rejects with an error
 */
export const login = async (formData: FormData) => {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error: "Invalid input",
      details: parsed.error.flatten(),
    };
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error: "Invalid email or password",
    };
  }

  await createSession(user.id, user.role);
  redirect(ROUTES.dashboard);
};

/**
 * Logs out the user by deleting the session and redirecting to the login page.
 * @returns - A promise that resolves when the logout is complete
 */
export async function logout() {
  await deleteSession();
  redirect(ROUTES.login);
}

"use server";

import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/login-schema";
import bcrypt from "bcryptjs";
import { ROUTES } from "@/lib/constants/story-canvas";
import { findUserByEmail } from "@/lib/dal/users";

/**
 * Authenticates a user using email and password, then creates a session and redirects to the dashboard.
 *
 * @param formData - A FormData object containing the user's email and password.
 *
 * @returns An object containing:
 * - `{ error: string, details?: any }` if validation or authentication fails.
 * - Or redirects to the dashboard on success (does not return).
 *
 * @throws Error - If an unexpected error occurs during session creation.
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

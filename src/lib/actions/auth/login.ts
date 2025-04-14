"use server";

import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/login-schema";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error: "Invalid email or password",
    };
  }

  await createSession(user.id);
  redirect("/admin/dashboard");
};

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

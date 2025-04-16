import { NextResponse } from "next/server";
import { getSession } from "./session";
import prisma from "@/lib/prisma";

/**
 * * Middleware function to check if the user is authenticated.
 * * @returns - The user object if authenticated, or a 401 Unauthorized response.
 */
export async function requireAuth() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  return user;
}

/**
 * Middleware function to check if the user is an admin.
 * @returns - The user object if authenticated and an admin, or a 403 Forbidden response.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}

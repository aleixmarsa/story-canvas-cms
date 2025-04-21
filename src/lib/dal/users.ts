import "server-only";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { UserForTable } from "@/types/user";
import { Role } from "@prisma/client";

/**
 * Fetches all users from the database.
 * @returns {Promise<{ UserForTable }[]>} - A promise that resolves to an array of users
 */
export const getAllUsers = async (): Promise<UserForTable[]> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    redirect(ROUTES.dashboard);
  }
};

export const countAllUsers = async (): Promise<
  { numberOfUsers: number } | { error: string }
> => {
  try {
    const userCount = await prisma.user.count();
    return {
      numberOfUsers: userCount,
    };
  } catch (error) {
    console.log("🚀 ~ countAllUsers ~ error:", error);
    return {
      error: "Error in Database",
    };
  }
};

export const userExists = async (): Promise<boolean> => {
  const count = await prisma.user.count();
  return count > 0;
};

export const createUser = async (
  email: string,
  hashedPassword: string,
  role: Role
) => {
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });
};

import "server-only";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { UserForTable } from "@/types/user";
import { Role } from "@prisma/client";

/**
 * Fetches all users from the database.
 *
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

/**
 * Counts all users in the database.
 *
 * @returns {Promise<{ numberOfUsers: number } | { error: string }>} - A promise that resolves to the number of users or an error message
 */
export const countAllUsers = async (): Promise<
  { numberOfUsers: number } | { error: string }
> => {
  try {
    const userCount = await prisma.user.count();
    return {
      numberOfUsers: userCount,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      error: "Error in Database",
    };
  }
};

/**
 * Checks if any user exists in the database.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if a user exists, false otherwise
 */
export const userExists = async (): Promise<boolean> => {
  const count = await prisma.user.count();
  return count > 0;
};

/**
 * Creates a new user in the database.
 *
 * @param email - The email of the user
 * @param hashedPassword - The hashed password of the user
 * @param role - The role of the user (e.g., ADMIN, EDITOR)
 * @returns {Promise<{ id: number; email: string; role: Role }>} - A promise that resolves to the created user
 */
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

/**
 * Finds a user by their email address.
 *
 * @param email - The email of the user to find
 * @returns {Promise<{ id: number; email: string; role: Role } | null>} - A promise that resolves to the user if found, or null if not
 */
export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Finds a user by its ID.
 *
 * @param id - The ID of the user to find
 * @returns {Promise<{ id: number; email: string; role: Role } | null>} - A promise that resolves to the user if found, or null if not
 */
export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

/**
 * Deletes a user by its ID.
 *
 * @param id - The ID of the user to delete
 * @returns {Promise<{ id: number; email: string; role: Role }>} - A promise that resolves to the deleted user
 */
export const deleteUserById = (id: string) => {
  return prisma.user.delete({ where: { id } });
};

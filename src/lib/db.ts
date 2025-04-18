import prisma from "./prisma";

/**
 * Checks if the database connection is alive by executing a simple query.
 * @returns {Promise<boolean>} - A promise that resolves to true if the connection is alive, false otherwise.
 */
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Error connecting to DB:", error);
    return false;
  }
};

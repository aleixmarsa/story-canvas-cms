import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

const prisma = new PrismaClient();

export const cleanupTestDatabase = async () => {
  console.log("Cleaning up database...");

  try {
    await prisma.$transaction([
      prisma.sectionVersion.deleteMany({}),
      prisma.storyVersion.deleteMany({}),
      prisma.section.deleteMany({}),
      prisma.story.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    console.log("Database cleanup complete.");
  } catch (error) {
    console.error("Failed to clean up database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  cleanupTestDatabase();
}

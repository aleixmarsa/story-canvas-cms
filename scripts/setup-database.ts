import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export const setupDatabase = () => {
  console.log("Setting up database...");

  console.log("Running prisma migrate reset to recreate schema...");
  execSync("pnpm prisma migrate reset --force --skip-generate --skip-seed", {
    stdio: "inherit",
  });

  console.log("Seeding the database...");
  execSync("pnpm prisma db seed", {
    stdio: "inherit",
  });

  console.log("Database setup complete.");
};

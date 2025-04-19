import { test as setup } from "@playwright/test";
import { setupDatabase } from "../scripts/setup-database";

setup("Reset and Seed Test DB", async () => {
  await setupDatabase();
});

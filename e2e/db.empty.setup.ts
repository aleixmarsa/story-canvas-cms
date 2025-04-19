import { test as setup } from "@playwright/test";
import { setupEmptyDatabase } from "../scripts/setup-empty-database";

setup("Reset Test DB", async () => {
  await setupEmptyDatabase();
});

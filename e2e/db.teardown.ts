import { test as teardown } from "@playwright/test";
import { cleanupTestDatabase } from "../scripts/cleanup-test-database";

teardown("Clean up Test DB", async () => {
  await cleanupTestDatabase();
});

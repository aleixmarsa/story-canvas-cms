import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Story list (admin)", () => {
  test("should display a seeded story in the list", async ({ page }) => {
    await page.goto(ROUTES.stories);
    await expect(
      page.getByRole("cell", { name: "Editor story visible in list" })
    ).toBeVisible();
  });
});

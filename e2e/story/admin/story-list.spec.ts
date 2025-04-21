import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Story list", () => {
  test("should display a seeded story in the list", async ({ page }) => {
    await page.goto(ROUTES.stories);
    await expect(page.getByText("Story visible in list")).toBeVisible();
  });
});

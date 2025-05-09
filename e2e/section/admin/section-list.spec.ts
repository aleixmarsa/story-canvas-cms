import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Section list (admin)", () => {
  test("should display a seeded section in the list", async ({ page }) => {
    await page.goto(`${ROUTES.stories}/story-list`);
    await expect(page.getByText("Section visible in list")).toBeVisible();
  });
});

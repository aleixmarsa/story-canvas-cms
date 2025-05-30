import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Story list (editor)", () => {
  test("should display a seeded story in the list", async ({ page }) => {
    await page.goto(`${ROUTES.stories}`);
    await expect(
      page.getByRole("cell", { name: "Editor story visible in list" })
    ).toBeVisible();
  });
});

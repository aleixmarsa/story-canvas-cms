import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Section list (editor)", () => {
  test("should display a seeded section in the list", async ({ page }) => {
    await page.goto(`${ROUTES.stories}/editor-story-list`);
    await expect(
      page.getByText("Editor Section visible in list")
    ).toBeVisible();
  });
});

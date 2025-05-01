import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Create story form (editor)", () => {
  test("should NOT display 'Add story' button", async ({ page }) => {
    await page.goto(ROUTES.stories);

    await expect(page.getByTestId("table-add-button")).not.toBeVisible();
  });

  test("should redirect if editor navigates to new story route", async ({
    page,
  }) => {
    await page.goto(ROUTES.newStory);
    await expect(page).toHaveURL(ROUTES.dashboard);
  });
});

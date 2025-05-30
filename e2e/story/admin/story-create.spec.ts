import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Create story form (admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.stories);
    await page.getByTestId("table-add-button").click();
  });

  test("should create a new story and redirect to draft editor", async ({
    page,
  }) => {
    const uniqueSlug = `test-story-${Date.now()}`;

    await page.getByTestId("create-story-title-input").fill("Test Story");
    await page.getByTestId("create-story-createdBy-input").fill("creator");
    await page.getByTestId("create-story-slug-input").fill(uniqueSlug);
    await page.getByTestId("header-save-button").click();

    await page.waitForURL(new RegExp(ROUTES.stories));

    await expect(page).toHaveURL(ROUTES.stories);
  });

  test("should show error if slug is already in use", async ({ page }) => {
    await page
      .getByTestId("create-story-title-input")
      .fill("Duplicate slug test");
    await page.getByTestId("create-story-createdBy-input").fill("creator");
    await page.getByTestId("create-story-slug-input").fill("story-list");

    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("This slug is already in use")).toBeVisible();
  });
});

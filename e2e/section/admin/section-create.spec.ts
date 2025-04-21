import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Create section form (admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ROUTES.stories}/story-list`);
    await page.getByTestId("header-add-button").click();
  });

  test("should create a new section and redirect to section list", async ({
    page,
  }) => {
    // Select a Title section type
    await page.getByTestId("section-type-select").click();
    await page.getByRole("option", { name: "TITLE" }).click();

    // Fill in the form fields
    await page.getByTestId("create-section-name-input").fill("Test Section");
    await page.getByTestId("create-section-order-input").fill("1");
    await page
      .getByTestId("create-section-createdBy-input")
      .fill("playwright-e2e");
    await page
      .getByTestId("create-section-text-input")
      .fill("Test section text");

    // Submit the form
    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("Section created successfully")).toBeVisible();

    await page.waitForURL(new RegExp(`/admin/dashboard/stories/story-list`));

    await expect(page.getByText("Test Section")).toBeVisible();
  });

  test("should show error if name is already in use", async ({ page }) => {
    // Select a Title section type
    await page.getByTestId("section-type-select").click();
    await page.getByRole("option", { name: "TITLE" }).click();

    // Fill in the form fields
    await page
      .getByTestId("create-section-name-input")
      .fill("Section visible in list");
    await page.getByTestId("create-section-order-input").fill("1");
    await page
      .getByTestId("create-section-createdBy-input")
      .fill("playwright-e2e");
    await page
      .getByTestId("create-section-text-input")
      .fill("Test section text");

    // Submit the form
    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("This name is already in use")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Create section form (editor)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ROUTES.stories}/editor-story-list`);
    await page.getByTestId("table-add-button").click();
  });

  test("should create a new section and redirect to section list", async ({
    page,
  }) => {
    // Select a Title section type
    await page.getByTestId("section-type-select").click();
    await page.getByRole("option", { name: "TITLE" }).click();

    // Fill in the form fields
    await page.getByTestId("create-section-name-input").fill("Test Section");
    await page
      .getByTestId("create-section-createdBy-input")
      .fill("playwright-e2e");
    await page
      .getByRole("tabpanel", { name: "Data" })
      .getByRole("paragraph")
      .fill("Test section text");

    // Submit the form
    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("Section created successfully")).toBeVisible();

    await page.waitForURL(
      new RegExp(`/admin/dashboard/stories/editor-story-list`)
    );
    await page.waitForTimeout(5000);

    await expect(page.getByText("Test Section")).toBeVisible();
  });
});

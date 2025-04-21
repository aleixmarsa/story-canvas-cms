import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/editor.json" });
test.describe.configure({ mode: "serial" });

test.describe("Edit section (editor)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ROUTES.stories}/editor-story-list`);
    // Clicks on edit button
    await page
      .getByRole("row", { name: "Editor Section to edit" })
      .getByTestId("row-actions-menu")
      .click();
    await page.getByTestId("action-edit-button").click();

    await page.waitForURL(
      new RegExp(
        "/admin/dashboard/stories/editor-story-list/editor-section-to-edit"
      )
    );
  });

  test("should show validation errors on empty form", async ({ page }) => {
    // Empty the form
    await page.getByTestId("create-section-name-input").fill("");
    await page.getByTestId("create-section-createdBy-input").fill("");
    await page.getByTestId("create-section-order-input").fill("");
    await page.getByTestId("create-section-text-input").fill("");
    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Author is required")).toBeVisible();
    await expect(page.getByText("Expected number")).toBeVisible();
    await expect(page.getByText("Title cannot be empty")).toBeVisible();
  });

  test("should show error if name is already in use", async ({ page }) => {
    // Use the slug that exists in the database
    await page
      .getByTestId("create-section-name-input")
      .fill("Editor Section visible in list");
    await page.getByTestId("header-save-button").click();
    await expect(page.getByText("This name is already in use")).toBeVisible();
  });

  test("should allow updating section title and slug", async ({ page }) => {
    // Checks if the form is prefilled with the correct values

    await expect(page.getByTestId("create-section-name-input")).toHaveValue(
      "Editor Section to edit"
    );
    await expect(
      page.getByTestId("create-section-createdBy-input")
    ).toHaveValue("editor@cms.com");
    await expect(page.getByTestId("create-section-text-input")).toHaveValue(
      "Editor Editable content"
    );

    // Updates the form and saves
    await page
      .getByTestId("create-section-name-input")
      .fill("Section edited via test");
    await page
      .getByTestId("create-section-createdBy-input")
      .fill("playwright-e2e");
    await page.getByTestId("create-section-text-input").fill("Edited content");
    await page.getByTestId("header-save-button").click();

    await page.waitForTimeout(3000);
    // Wait for the success message and updated the URL
    await expect(page.getByText("Section updated successfully")).toBeVisible;

    await expect(page).toHaveURL(
      "/admin/dashboard/stories/editor-story-list/section-edited-via-test"
    );

    // Check if the section is updated in the list
    await page.goto(`${ROUTES.stories}/editor-story-list`);
    await expect(page.getByText("Section edited via test")).toBeVisible();
    await expect(page.getByText("Editor Section to edit")).not.toBeVisible();
  });
});

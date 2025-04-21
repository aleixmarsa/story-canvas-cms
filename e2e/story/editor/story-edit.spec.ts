import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/editor.json" });
test.describe.configure({ mode: "serial" });

test.describe("Edit story (editor)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.stories);
    // Clicks on edit button
    await page
      .getByRole("row", { name: "Editor Story to edit" })
      .getByTestId("row-actions-menu")
      .click();
    await page.getByTestId("action-edit-button").click();

    await page.waitForURL(
      new RegExp("/admin/dashboard/stories/editor-story-edit/edit")
    );
  });

  test("should show validation errors on empty form", async ({ page }) => {
    // Empty the form
    await page.getByTestId("edit-story-title-input").fill("");
    await page.getByTestId("edit-story-createdBy-input").fill("");
    await page.getByTestId("edit-story-slug-input").fill("t");
    await page.getByTestId("header-save-button").click();

    await expect(page.getByText("Title is required")).toBeVisible();
    await expect(page.getByText("Author is required")).toBeVisible();
    await expect(
      page.getByText("String must contain at least 3 character(s)")
    ).toBeVisible();
  });

  test("should show error if slug is already in use", async ({ page }) => {
    // Use the slug that exists in the database
    await page.getByLabel("Slug (URL)").fill("editor-story-list");
    await page.getByTestId("header-save-button").click();
    await expect(page.getByText("This slug is already in use")).toBeVisible();
  });

  test("should allow updating story title and slug", async ({ page }) => {
    // Checks if the form is prefilled with the correct values
    await expect(page.getByLabel("Title")).toHaveValue("Editor Story to edit");
    await expect(page.getByLabel("Slug (URL)")).toHaveValue(
      "editor-story-edit"
    );

    // Updates the form and saves
    await page
      .getByTestId("edit-story-title-input")
      .fill("Editor Story edited via test");
    await page.getByTestId("edit-story-createdBy-input").fill("editor-e2e");
    await page
      .getByTestId("edit-story-slug-input")
      .fill("editor-story-edited-test");
    await page.getByTestId("header-save-button").click();

    // Wait for the success message and updated the URL
    await expect(page.getByText("Story updated successfully")).toBeVisible;
    await expect(page).toHaveURL(
      "/admin/dashboard/stories/editor-story-edited-test/edit"
    );

    // Check if the story is updated in the list
    await page.goto(ROUTES.stories);
    await expect(page.getByText("Editor Story edited via test")).toBeVisible();
    await expect(
      page.getByText("Editor Story to edit", { exact: true })
    ).not.toBeVisible();
    await expect(page.getByText("editor-e2e")).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "editor-story-edited-test" })
    ).toBeVisible();
  });
});

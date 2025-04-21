import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

test.use({ storageState: "playwright/.auth/admin.json" });
test.describe.configure({ mode: "serial" });

test.describe("Delete story behavior (admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.stories);
    await page
      .getByRole("row", { name: "Story to delete" })
      .getByTestId("row-actions-menu")
      .click();
    await page.getByTestId("delete-dialog-trigger").click();
    await expect(page.getByTestId("delete-dialog-title")).toBeVisible();
    await expect(page.getByTestId("delete-dialog-description")).toBeVisible();
    await expect(page.getByTestId("delete-dialog-cancel-button")).toBeVisible();

    const deleteButton = page.getByTestId("delete-dialog-confirm-button");
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  });

  test("should allow undo after deleting a story", async ({ page }) => {
    // Check if the undo toast is visible
    const undoButton = page.getByRole("button", { name: "Undo" });
    await expect(undoButton).toBeVisible();

    await expect(page.getByText("Story has been removed")).toBeVisible();

    await undoButton.click();

    await expect(page.getByText("Story has been restored")).toBeVisible();

    // Check if the story is restored
    await expect(
      page.getByRole("row", { name: "Story to delete" })
    ).toBeVisible();
  });

  test("should permanently delete a story", async ({ page }) => {
    await expect(page.getByText("Story has been removed")).toBeVisible();
    await page.waitForTimeout(5000); // Wait for the toast to auto-close
    await expect(page.getByText("Story has been removed")).not.toBeVisible();
    await expect(
      page.getByRole("row", { name: "Story to delete" })
    ).not.toBeVisible();
  });
});

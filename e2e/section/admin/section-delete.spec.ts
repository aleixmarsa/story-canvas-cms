import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/admin.json" });
test.describe.configure({ mode: "serial" });

test.describe("Delete section behavior (admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ROUTES.stories}/story-list`);
    await page
      .getByRole("button", { name: "Section to delete draft section" })
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

  test("should allow undo after deleting a section", async ({ page }) => {
    // Check if the undo toast is visible
    const undoButton = page.getByRole("button", { name: "Undo" });
    await expect(undoButton).toBeVisible();

    await expect(page.getByText("Section has been removed")).toBeVisible();

    await undoButton.click();

    // Check if the section is restored
    await expect(
      page.getByRole("button", { name: "Section to delete draft" })
    ).toBeVisible();
  });

  test("should permanently delete a section", async ({ page }) => {
    await expect(page.getByText("Section has been removed")).toBeVisible();
    await page.waitForTimeout(5000); // Wait for the toast to auto-close
    await expect(page.getByText("Section has been removed")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Section to delete draft" })
    ).not.toBeVisible();
  });
});

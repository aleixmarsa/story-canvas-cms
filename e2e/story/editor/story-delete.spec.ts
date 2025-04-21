import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/storyCanvas";

// Use editor session
test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Delete story permissions (editor)", () => {
  test("should NOT show delete option in row actions menu", async ({
    page,
  }) => {
    await page.goto(`${ROUTES.stories}`);

    const sectionRow = page.getByRole("row", {
      name: "Editor Story visible in list",
    });

    await expect(sectionRow).toBeVisible();

    await sectionRow.getByTestId("row-actions-menu").click();

    // The row-actions-menu should NOT be rendered for editor
    await expect(page.getByTestId("delete-dialog-trigger")).not.toBeVisible();
  });
});

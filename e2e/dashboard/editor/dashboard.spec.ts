import { test, expect } from "@playwright/test";
import { ROUTES } from "@/lib/constants/story-canvas";

test.use({ storageState: "playwright/.auth/editor.json" });

test.describe("Dashboard homepage (editor)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dashboard);
  });
  test("should display welcome message and navigation cards", async ({
    page,
  }) => {
    //Check if the welcome message is visible
    await expect(
      page.getByRole("heading", { name: "Welcome to the dashboard" })
    ).toBeVisible();

    // Check if the stories card is visible
    const storiesCard = page.getByTestId("dashboard-stories-cards");
    await expect(storiesCard).toBeVisible();

    // Check if the users card is visible
    const usersCard = page.getByTestId("dashboard-users-cards");

    await expect(usersCard).toBeVisible();
  });

  test("should navigate to stories page when clicking on Stories", async ({
    page,
  }) => {
    await page.getByTestId("dashboard-stories-cards").click();

    await expect(page).toHaveURL(ROUTES.stories);
  });

  test("should navigate to users page when clicking on Users", async ({
    page,
  }) => {
    await page.getByTestId("dashboard-users-cards").click();

    await expect(page).toHaveURL(ROUTES.users);
  });
});

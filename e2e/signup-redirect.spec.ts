import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/constants/storyCanvas";

const adminRoutes = [
  ROUTES.admin,
  ROUTES.dashboard,
  ROUTES.users,
  ROUTES.login,
  ROUTES.error,
];

test.describe("Redirection to initial user creation", () => {
  for (const route of adminRoutes) {
    test(`should redirect ${route} to /admin/create-initial-user when no users exist`, async ({
      page,
    }) => {
      await page.goto(route);

      // Checks if the user is redirected to the initial user creation page
      await expect(page).toHaveURL(ROUTES.createInitalUser);

      // Checks if the signup form is visible
      await expect(page.getByTestId("signup-form-title")).toBeVisible();
      await expect(page.getByTestId("signup-form-email-input")).toBeVisible();
      await expect(
        page.getByTestId("signup-form-password-input")
      ).toBeVisible();
      await expect(
        page.getByTestId("signup-form-confirm-password-input")
      ).toBeVisible();
    });
  }
});

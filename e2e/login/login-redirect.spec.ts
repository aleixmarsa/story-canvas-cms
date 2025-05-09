import { test, expect } from "@playwright/test";
import { ROUTES } from "../../src/lib/constants/story-canvas";

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

const adminRoutes = [
  ROUTES.admin,
  ROUTES.dashboard,
  ROUTES.users,
  ROUTES.createInitalUser,
  ROUTES.error,
];

test.describe("Redirect to login page when user is not authenticated", () => {
  for (const route of adminRoutes) {
    test(`should redirect ${route} to /admin/login when a user exists`, async ({
      page,
    }) => {
      await page.goto(route);

      // Checks if the user is redirected to the initial user creation page
      await expect(page).toHaveURL(ROUTES.login);

      // Checks if the signup form is visible
      await expect(page.getByTestId("login-form-title")).toBeVisible();
      await expect(page.getByTestId("login-form-email-input")).toBeVisible();
      await expect(page.getByTestId("login-form-password-input")).toBeVisible();
    });
  }
});

import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/constants/storyCanvas";

const adminRoutes = [
  ROUTES.admin,
  ROUTES.dashboard,
  ROUTES.users,
  ROUTES.createInitalUser,
  ROUTES.error,
];

test.describe("Redirection to initial user creation", () => {
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

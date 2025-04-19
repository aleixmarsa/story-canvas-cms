import { test, expect } from "@playwright/test";
import { ROUTES } from "../../src/lib/constants/storyCanvas";

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login process", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.login);
    await expect(page.getByTestId("login-form-title")).toBeVisible();
  });
  test("should show validation errors with empty form", async ({ page }) => {
    // Clicks the login button without filling the form
    await page.getByRole("button", { name: "Login" }).click();

    // Check if the validation errors are displayed
    await expect(page.getByText(/email/i)).toBeVisible();
    await expect(page.getByText(/password/i)).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    //Fills the form with invalid credentials
    await page.getByTestId("login-form-email-input").fill("admin@cms.test");
    await page.getByTestId("login-form-password-input").fill("wrong-password");
    await page.getByRole("button", { name: "Login" }).click();

    // Check if the user is not redirected to another page and the error message is displayed
    await expect(page).toHaveURL(ROUTES.login);
    await page.getByText("Invalid email or password");
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    //Fills the form with valid credentials
    await page.getByTestId("login-form-email-input").fill("admin@cms.com");
    await page.getByTestId("login-form-password-input").fill("securepassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for the URL to change to the dashboard
    await page.waitForURL(ROUTES.dashboard);
  });
});

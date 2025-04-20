import { test as setup, expect } from "@playwright/test";
import path from "path";
import { ROUTES } from "../src/lib/constants/storyCanvas";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto(ROUTES.login);
  await expect(page.getByTestId("login-form-title")).toBeVisible();

  //Fills the form with valid credentials
  await page.getByTestId("login-form-email-input").fill("admin@cms.com");
  await page.getByTestId("login-form-password-input").fill("securepassword");
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for the URL to change to the dashboard
  await page.waitForURL(ROUTES.dashboard);

  // Save the storage state to a file.
  await page.context().storageState({ path: authFile });
});

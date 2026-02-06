import { test, expect } from "@playwright/test";

test.describe("Signup page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("shows signup form with required fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
  });

  test("validates email and password on submit", async ({ page }) => {
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText("Email is required", { exact: true })).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    // Disable HTML5 validation so react-hook-form/zod validation runs
    await page.getByTestId("signup-form-element").evaluate((el) => {
      (el as HTMLFormElement).noValidate = true;
    });
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
  });

  test("disables submit button during loading", async ({ page }) => {
    // Delay API response so we can assert loading state
    await page.route("**/v1/auth/signup", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          data: { message: "OK" },
          error: null,
          correlationId: "test-id",
        }),
      });
    });

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    const submitBtn = page.getByRole("button", { name: "Sign up" });

    const clickPromise = submitBtn.click();
    await expect(page.getByRole("button", { name: "Creating account…" })).toBeVisible();
    await clickPromise;
  });

  test("shows success state after successful signup", async ({ page }) => {
    // When E2E_USE_REAL_API=1, hit real backend; otherwise mock
    if (!process.env.E2E_USE_REAL_API) {
      await page.route("**/v1/auth/signup", async (route) => {
        await route.fulfill({
          status: 202,
          contentType: "application/json",
          body: JSON.stringify({
            data: { message: "If an account with that email exists, a verification link has been sent." },
            error: null,
            correlationId: "test-correlation-id",
          }),
        });
      });
    }

    // Use unique email to avoid conflicts when running against real API
    const email = process.env.E2E_USE_REAL_API
      ? `e2e-${Date.now()}@example.com`
      : "user@example.com";

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect(page.getByText(/verification link/)).toBeVisible();
  });

  test("shows error state with correlationId when API fails", async ({ page }) => {
    await page.route("**/v1/auth/signup", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Invalid request" },
          correlationId: "err-123",
        }),
      });
    });

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText("err-123")).toBeVisible();
  });
});

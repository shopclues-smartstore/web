import { defineConfig, devices } from "@playwright/test";

const useRealApi = !!process.env.E2E_USE_REAL_API;
const apiUrl = process.env.E2E_API_URL ?? "http://localhost:3000";

/**
 * Playwright e2e config. See https://playwright.dev/docs/test-configuration
 * Set E2E_USE_REAL_API=1 to run against real backend (server must be startable).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: useRealApi
    ? [
        {
          command: "cd ../server && npm run dev",
          url: `${apiUrl}/health/live`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
        {
          command: `VITE_API_URL=${apiUrl} npm run build && npm run preview`,
          url: "http://localhost:4173",
          reuseExistingServer: !process.env.CI,
          timeout: 90_000,
        },
      ]
    : {
        command: "npm run build && npm run preview",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});

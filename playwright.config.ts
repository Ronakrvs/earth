import { defineConfig, devices } from "@playwright/test"

/**
 * Shigruvedas E2E Test Configuration
 * Run: npx playwright test
 * UI mode: npx playwright test --ui
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // Keep false — tests share auth state via storageState
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Give pages time to load (Next.js SSR can be slow in dev mode)
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },

  projects: [
    // ── Setup project: logs in once and saves session ──────────────────────
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
    },

    // ── Desktop Chromium ───────────────────────────────────────────────────
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testIgnore: ["**/mobile.spec.ts", "**/global.setup.ts"],
    },

    // ── Mobile Viewport (375px) ─────────────────────────────────────────
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: "**/mobile.spec.ts",
    },

    // ── Auth tests run without saved auth state ────────────────────────────
    {
      name: "auth-tests",
      use: {
        ...devices["Desktop Chrome"],
        // No storageState — auth tests handle login themselves
      },
      testMatch: "**/auth.spec.ts",
    },
  ],
})

/**
 * global.setup.ts
 *
 * Runs once before the test suite. Logs in with TEST_USER_EMAIL / TEST_USER_PASSWORD
 * and persists the browser storage state so every subsequent test starts authenticated.
 *
 * Usage: automatically picked up by the "setup" project in playwright.config.ts
 */
import { test as setup, expect } from "@playwright/test"
import { loginUser, ensureAuthDir, AUTH_STATE_PATH } from "./helpers/auth"

setup("authenticate test user", async ({ page }) => {
  ensureAuthDir()

  await loginUser(page)

  // Confirm we landed somewhere that is NOT the login page
  await expect(page).not.toHaveURL(/\/auth\/login/)

  // Persist storage state (cookies + localStorage) for reuse
  await page.context().storageState({ path: AUTH_STATE_PATH })
})

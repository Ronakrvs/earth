import { type Page, expect } from "@playwright/test"
import * as path from "path"
import * as fs from "fs"

export const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || ""
export const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || ""
export const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || ""
export const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || ""

/**
 * Auth state file location (used by the Playwright setup project).
 * After `global.setup.ts` runs, all other test projects load from this file.
 */
export const AUTH_STATE_PATH = path.join(
  __dirname,
  "..",
  ".auth",
  "user.json"
)

/**
 * Fills the Shigruvedas login form and submits it.
 * Waits until the navbar shows the user avatar (a sign that the session loaded).
 *
 * @param page      - Playwright Page
 * @param email     - Test user e-mail (defaults to TEST_USER_EMAIL env var)
 * @param password  - Test user password (defaults to TEST_USER_PASSWORD env var)
 */
export async function loginUser(
  page: Page,
  email = TEST_USER_EMAIL,
  password = TEST_USER_PASSWORD
): Promise<void> {
  if (!email || !password) {
    throw new Error(
      "Missing credentials. Set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars."
    )
  }

  await page.goto("/auth/login")

  // Fill email field (id="email")
  await page.fill("#email", email)

  // Fill password field (id="password")
  await page.fill("#password", password)

  // Click the submit button ("Secure Entry")
  await page.click('button[type="submit"]')

  // Wait for redirect away from /auth/login
  await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
    timeout: 15_000,
  })
}

/**
 * Ensures the auth state directory exists.
 * Called from global.setup.ts before saving storageState.
 */
export function ensureAuthDir(): void {
  const dir = path.join(__dirname, "..", ".auth")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Returns true when the page is on a protected route and was redirected to
 * the login page (i.e. access is denied).
 */
export async function isRedirectedToLogin(page: Page): Promise<boolean> {
  return page.url().includes("/auth/login")
}

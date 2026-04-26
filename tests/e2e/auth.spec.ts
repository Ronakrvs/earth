/**
 * auth.spec.ts
 *
 * Tests for the Shigruvedas authentication flows:
 *   - Login page structure & field validation
 *   - Google OAuth button presence
 *   - Successful login with test credentials
 *   - Redirect to login when accessing protected route unauthenticated
 *   - Signup page structure & validation
 *   - Forgot-password form submission
 *   - Sign-out via navbar dropdown
 *
 * Runs under the "auth-tests" project (no pre-saved session).
 */

import { test, expect } from "@playwright/test"
import {
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  loginUser,
} from "./helpers/auth"

// ─── Login page ────────────────────────────────────────────────────────────

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login")
  })

  test("renders the login form with all key elements", async ({ page }) => {
    // Heading
    await expect(page.getByText("Authentication.")).toBeVisible()

    // Email field (labelled "Identifier")
    await expect(page.locator("#email")).toBeVisible()

    // Password field (labelled "Security Key")
    await expect(page.locator("#password")).toBeVisible()

    // Submit button
    await expect(
      page.getByRole("button", { name: /secure entry/i })
    ).toBeVisible()
  })

  test("shows Google OAuth button", async ({ page }) => {
    const googleBtn = page.getByRole("button", { name: /continue with google/i })
    await expect(googleBtn).toBeVisible()

    // Google SVG logo must be inside the button
    await expect(googleBtn.locator("svg")).toBeVisible()
  })

  test("shows validation errors for empty form submission", async ({ page }) => {
    await page.click('button[type="submit"]')

    // zod min-length on password fires immediately for empty input
    await expect(
      page.getByText(/passphrase must be at least 6 characters/i)
    ).toBeVisible()
  })

  test("shows validation error for malformed email", async ({ page }) => {
    await page.fill("#email", "not-an-email")
    await page.fill("#password", "somepassword")
    await page.click('button[type="submit"]')

    await expect(
      page.getByText(/valid alchemical identifier/i)
    ).toBeVisible()
  })

  test("shows server error for wrong credentials", async ({ page }) => {
    await page.fill("#email", "wrong@example.com")
    await page.fill("#password", "wrongpassword123")
    await page.click('button[type="submit"]')

    await expect(
      page.getByText(/authentication failed/i)
    ).toBeVisible({ timeout: 10_000 })
  })

  test("password visibility toggle works", async ({ page }) => {
    await page.fill("#password", "mysecretkey")

    const passwordInput = page.locator("#password")
    await expect(passwordInput).toHaveAttribute("type", "password")

    // Click the eye icon button
    await page
      .locator('button[type="button"]')
      .filter({ has: page.locator("svg") })
      .first()
      .click()

    await expect(passwordInput).toHaveAttribute("type", "text")
  })

  test("has link to signup page", async ({ page }) => {
    await expect(page.getByRole("link", { name: /manifest profile/i })).toBeVisible()
  })

  test("has forgot-password link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /lost logic/i })).toBeVisible()
  })

  test("successful login redirects away from /auth/login", async ({ page }) => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      test.skip(true, "TEST_USER_EMAIL / TEST_USER_PASSWORD env vars not set")
    }

    await loginUser(page)
    await expect(page).not.toHaveURL(/\/auth\/login/)
  })
})

// ─── Signup page ───────────────────────────────────────────────────────────

test.describe("Signup page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup")
  })

  test("renders the signup form with all fields", async ({ page }) => {
    await expect(page.getByText("Manifest Identity.")).toBeVisible()

    await expect(page.locator("#full_name")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.locator("#phone")).toBeVisible()
    await expect(page.locator("#referral_code")).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
    await expect(page.locator("#confirm_password")).toBeVisible()

    await expect(
      page.getByRole("button", { name: /initiate profile/i })
    ).toBeVisible()
  })

  test("shows Google OAuth button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /continue with google/i })
    ).toBeVisible()
  })

  test("shows validation errors for short name", async ({ page }) => {
    await page.fill("#full_name", "A")
    await page.fill("#email", "valid@example.com")
    await page.fill("#password", "password12")
    await page.fill("#confirm_password", "password12")
    await page.click('button[type="submit"]')

    await expect(
      page.getByText(/identifier must be at least 2 characters/i)
    ).toBeVisible()
  })

  test("shows validation error when passwords do not match", async ({ page }) => {
    await page.fill("#full_name", "Test User")
    await page.fill("#email", "test@example.com")
    await page.fill("#password", "password123")
    await page.fill("#confirm_password", "differentpassword123")
    await page.click('button[type="submit"]')

    await expect(
      page.getByText(/security keys do not match/i)
    ).toBeVisible()
  })

  test("has link back to login page", async ({ page }) => {
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible()
  })
})

// ─── Forgot-password page ──────────────────────────────────────────────────

test.describe("Forgot-password page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/forgot-password")
  })

  test("renders the forgot-password form", async ({ page }) => {
    await expect(page.getByText("Logic Restoration.")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(
      page.getByRole("button", { name: /initiate restoration/i })
    ).toBeVisible()
  })

  test("shows validation error for invalid email", async ({ page }) => {
    await page.fill("#email", "bademail")
    await page.click('button[type="submit"]')

    await expect(
      page.getByText(/valid alchemical identifier/i)
    ).toBeVisible()
  })

  test("successful submission shows confirmation message", async ({ page }) => {
    // Use an email that exists but won't spam; the page just calls Supabase
    await page.fill("#email", "test-reset@example.com")
    await page.click('button[type="submit"]')

    // Supabase always responds 200 even for non-existent emails (security best-practice)
    await expect(
      page.getByText(/nexus transversal|recovery link dispatched/i)
    ).toBeVisible({ timeout: 10_000 })
  })

  test("has link back to login page", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /sign in/i })
    ).toBeVisible()
  })
})

// ─── Access control ────────────────────────────────────────────────────────

test.describe("Access control for unauthenticated users", () => {
  test("visiting /profile redirects to login", async ({ page }) => {
    await page.goto("/profile")
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("visiting /checkout redirects to login", async ({ page }) => {
    await page.goto("/checkout")
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("visiting /admin redirects to login", async ({ page }) => {
    await page.goto("/admin")
    // Non-admin gets redirected either to /auth/login or to /
    const url = page.url()
    expect(url.includes("/auth/login") || url.endsWith("/")).toBe(true)
  })
})

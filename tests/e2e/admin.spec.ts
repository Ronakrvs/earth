import { test, expect } from "@playwright/test"
import { loginUser } from "./helpers/auth"

// Admin tests — use admin credentials from env vars
test.describe("Admin Access Control", () => {
  // Run admin tests without saved auth state so we can test with admin account
  test.use({ storageState: { cookies: [], origins: [] } })

  test("admin panel requires authentication", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/auth\/login/, { timeout: 8_000 })
  })

  test("regular user cannot access admin panel", async ({ page }) => {
    // Login as regular user
    if (!process.env.TEST_USER_EMAIL) {
      test.skip()
      return
    }
    await loginUser(page)
    await page.goto("/admin")
    // Should redirect away (login page or home)
    const url = page.url()
    expect(url).not.toMatch(/\/admin$/)
  })

  test("admin user can access admin dashboard", async ({ page }) => {
    if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
      test.skip()
      return
    }
    await loginUser(page, process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD)
    await page.goto("/admin")
    await expect(page.locator("text=/admin|dashboard/i").first()).toBeVisible({ timeout: 10_000 })
  })

  test("admin analytics page works", async ({ page }) => {
    if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
      test.skip()
      return
    }
    await loginUser(page, process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD)
    await page.goto("/admin/analytics")
    // Revenue should show a number (not NaN or empty)
    await page.waitForLoadState("networkidle")
    const revenueText = await page.locator("text=/₹/").first().textContent().catch(() => "")
    expect(revenueText).not.toBe("")
  })

  test("admin orders page lists orders", async ({ page }) => {
    if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
      test.skip()
      return
    }
    await loginUser(page, process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD)
    await page.goto("/admin/orders")
    await expect(page.locator("text=/order|orders/i").first()).toBeVisible({ timeout: 10_000 })
  })

  test("admin users page lists users", async ({ page }) => {
    if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
      test.skip()
      return
    }
    await loginUser(page, process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD)
    await page.goto("/admin/users")
    await expect(page.locator("text=/user|email/i").first()).toBeVisible({ timeout: 10_000 })
  })
})

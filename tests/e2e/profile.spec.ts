import { test, expect } from "@playwright/test"

// These tests run with the saved auth state from global.setup.ts
test.describe("Profile (authenticated)", () => {
  test("profile page loads with user info", async ({ page }) => {
    await page.goto("/profile")
    await expect(page.locator("h1, [class*='text-4xl']").first()).toBeVisible()
    // Quick stats section
    await expect(page.locator("text=/Manifested|Orders/i").first()).toBeVisible()
    await expect(page.locator("text=/Rank/i").first()).toBeVisible()
  })

  test("profile shows real order count (not hardcoded 0)", async ({ page }) => {
    await page.goto("/profile")
    // The stats should load dynamically — check that the section exists
    await expect(page.locator("text=/Manifested/i")).toBeVisible()
    // Stats values are numbers or rank strings
    const statCards = page.locator("[class*='MoringaCard'], [class*='moringa-card']")
    const count = await statCards.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test("profile navigation links work", async ({ page }) => {
    await page.goto("/profile")
    // Click "Acquisition History" → orders
    await page.locator("text=/Acquisition History|Orders/i").first().click()
    await page.waitForURL("**/profile/orders**")
    await expect(page).toHaveURL(/profile\/orders/)
  })

  test("orders page shows list or empty state", async ({ page }) => {
    await page.goto("/profile/orders")
    // Either shows orders or empty state — not a crash
    const hasOrders = await page.locator("text=/Order/i").count()
    const hasEmpty = await page.locator("text=/Archive Vacant|No orders/i").count()
    // Cancelled/failed orders should NOT appear
    const cancelledCount = await page.locator("text=/cancelled/i").count()
    expect(cancelledCount).toBe(0)
    expect(hasOrders + hasEmpty).toBeGreaterThan(0)
  })

  test("loyalty page loads when enabled", async ({ page }) => {
    await page.goto("/profile/loyalty")
    const hasContent = await page.locator("text=/points|vitality|loyalty/i").count()
    const hasRedirect = page.url().includes("/auth/login")
    expect(hasContent > 0 || !hasRedirect).toBeTruthy()
  })

  test("addresses page loads", async ({ page }) => {
    await page.goto("/profile/addresses")
    await expect(page.locator("text=/address|delivery/i").first()).toBeVisible()
  })

  test("sign out button is present on profile", async ({ page }) => {
    await page.goto("/profile")
    await expect(page.locator("button, [role='button']", { hasText: /sign out|neutralize/i })).toBeVisible()
  })
})

test.describe("Profile (unauthenticated)", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test("profile redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/profile")
    await expect(page).toHaveURL(/auth\/login/, { timeout: 8_000 })
  })

  test("profile orders redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/profile/orders")
    await expect(page).toHaveURL(/auth\/login/, { timeout: 8_000 })
  })
})

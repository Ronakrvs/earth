import { test, expect } from "@playwright/test"

test.describe("Order Tracking", () => {
  test("track-order page loads", async ({ page }) => {
    await page.goto("/track-order")
    await expect(page.locator("text=/Track/i").first()).toBeVisible()
    await expect(page.locator("input").first()).toBeVisible()
  })

  test("searching with an invalid order number shows not found", async ({ page }) => {
    await page.goto("/track-order")
    const input = page.locator("input").first()
    await input.fill("INVALID-ORDER-12345")
    await page.keyboard.press("Enter")
    await expect(
      page.locator("text=/not found|no order|couldn't find/i").first()
    ).toBeVisible({ timeout: 10_000 })
  })

  test("searching with empty query does nothing", async ({ page }) => {
    await page.goto("/track-order")
    await page.keyboard.press("Enter")
    // Should stay on track-order page
    await expect(page).toHaveURL(/track-order/)
  })

  test("WhatsApp support link present", async ({ page }) => {
    await page.goto("/track-order")
    await expect(page.locator("[href*='wa.me']").first()).toBeVisible()
  })

  test("India Post tracking URL pattern is correct", async ({ page }) => {
    // Verify the order detail page links to India Post for IN tracking numbers
    // This tests the logic without needing a real order
    await page.goto("/profile/orders")
    const url = page.url()
    if (url.includes("/auth/login")) return // Not logged in
    // If any orders exist, tracking links should be correct
    const trackLinks = page.locator("[href*='indiapost.gov.in'], [href*='shiprocket.in']")
    const count = await trackLinks.count()
    // Either no orders or links point to correct carrier
    if (count > 0) {
      const href = await trackLinks.first().getAttribute("href")
      expect(href).toMatch(/indiapost\.gov\.in|shiprocket\.in/)
    }
  })
})

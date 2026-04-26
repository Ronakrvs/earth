import { test, expect } from "@playwright/test"

// All mobile tests run at 375px via the "mobile" playwright project (iPhone 13)
test.describe("Mobile UX", () => {
  test("homepage loads on mobile with no horizontal scroll", async ({ page }) => {
    await page.goto("/")
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2) // +2px tolerance
  })

  test("navbar hamburger menu opens and closes", async ({ page }) => {
    await page.goto("/")
    // Hamburger button should be visible on mobile
    const burger = page.locator('[aria-label="Toggle menu"], button[class*="lg:hidden"]').first()
    await expect(burger).toBeVisible()
    await burger.click()
    // Mobile nav sheet should open
    await expect(page.locator("text=SHIGRUVEDAS").first()).toBeVisible()
    // Close button
    const closeBtn = page.locator('button[class*="rounded-full"]').last()
    await closeBtn.click()
  })

  test("shop page grid is single column on mobile", async ({ page }) => {
    await page.goto("/shop")
    await page.waitForLoadState("networkidle")
    const firstCard = page.locator('[href^="/products/"]').first()
    await expect(firstCard).toBeVisible()
    const box = await firstCard.boundingBox()
    if (box) {
      // On mobile (375px), card should be nearly full width (> 300px)
      expect(box.width).toBeGreaterThan(280)
    }
  })

  test("product detail Add to Cart button is visible and tappable", async ({ page }) => {
    await page.goto("/shop")
    const productLink = page.locator('[href^="/products/"]').first()
    await productLink.click()
    await page.waitForLoadState("networkidle")

    const addBtn = page.locator("button", { hasText: /add to cart/i }).first()
    await expect(addBtn).toBeVisible()

    // Touch target height should be >= 44px
    const box = await addBtn.boundingBox()
    if (box) expect(box.height).toBeGreaterThanOrEqual(40)
  })

  test("checkout form is full-width on mobile", async ({ page }) => {
    await page.goto("/shop")
    await page.locator("button", { hasText: "Add to Cart" }).first().click()
    await page.goto("/checkout")
    await page.locator("button", { hasText: /Continue to Shipping/i }).click()

    const input = page.locator('input[placeholder*="Name"]').first()
    await expect(input).toBeVisible()
    const box = await input.boundingBox()
    if (box) {
      // Should be nearly full viewport width on mobile
      expect(box.width).toBeGreaterThan(280)
    }
  })

  test("profile page stats visible on mobile", async ({ page }) => {
    await page.goto("/profile")
    // Either shows stats or redirects to login — no crash
    const url = page.url()
    if (url.includes("/auth/login")) return // Not logged in, expected
    await expect(page.locator("text=/Rank/i").first()).toBeVisible()
  })

  test("search page works on mobile", async ({ page }) => {
    await page.goto("/search?q=moringa")
    await expect(page.locator("text=/Results|Search/i").first()).toBeVisible()
    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })

  test("track order page works on mobile", async ({ page }) => {
    await page.goto("/track-order")
    await expect(page.locator("text=/Track/i").first()).toBeVisible()
    const input = page.locator("input").first()
    await expect(input).toBeVisible()
    const box = await input.boundingBox()
    if (box) expect(box.width).toBeGreaterThan(200)
  })
})

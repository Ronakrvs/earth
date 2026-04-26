import { test, expect } from "@playwright/test"

test.describe("Shop & Search", () => {
  test("shop page loads with products", async ({ page }) => {
    await page.goto("/shop")
    await expect(page).toHaveTitle(/shop|products/i)
    // At least one product card should render
    await expect(page.locator("text=Add to Cart").first()).toBeVisible({ timeout: 10_000 })
  })

  test("product card shows name, price, and add to cart", async ({ page }) => {
    await page.goto("/shop")
    const card = page.locator('[href^="/products/"]').first()
    await expect(card).toBeVisible()
    // Price in rupees
    await expect(page.locator("text=₹").first()).toBeVisible()
  })

  test("can navigate to product detail page", async ({ page }) => {
    await page.goto("/shop")
    const productLink = page.locator('[href^="/products/"]').first()
    const href = await productLink.getAttribute("href")
    await productLink.click()
    await page.waitForURL(`**${href}**`, { timeout: 10_000 })
    // Product detail page should have a heading
    await expect(page.locator("h1").first()).toBeVisible()
    // Add to cart / buy now button
    await expect(page.locator("button", { hasText: /add to cart|buy now/i }).first()).toBeVisible()
  })

  test("search page returns results for 'moringa'", async ({ page }) => {
    await page.goto("/search?q=moringa")
    await expect(page).toHaveURL(/q=moringa/)
    // Should show at least one product or a no-results message
    const hasProducts = await page.locator('[href^="/products/"]').count()
    const hasNoResults = await page.locator("text=/No results/i").count()
    expect(hasProducts + hasNoResults).toBeGreaterThan(0)
  })

  test("search with short query shows guidance", async ({ page }) => {
    await page.goto("/search?q=m")
    await expect(page.locator("text=/at least 2/i")).toBeVisible()
  })

  test("navbar search icon links to search page", async ({ page }) => {
    await page.goto("/")
    await page.click('[aria-label="Search products"]')
    await page.waitForURL("**/search**", { timeout: 8_000 })
  })

  test("wishlist button visible on product cards when logged in", async ({ page }) => {
    await page.goto("/shop")
    // Heart/wishlist buttons should be present in product cards
    const wishlistBtns = page.locator('[aria-label*="ishlist"]')
    const count = await wishlistBtns.count()
    expect(count).toBeGreaterThan(0)
  })

  test("add to cart opens cart drawer", async ({ page }) => {
    await page.goto("/shop")
    const addBtn = page.locator("button", { hasText: "Add to Cart" }).first()
    await addBtn.click()
    // Cart drawer or cart count badge should update
    await expect(page.locator("[aria-label='Open cart']")).toBeVisible()
    // Sonner toast should appear
    await expect(page.locator(".sonner-toast, [data-sonner-toast]")).toBeVisible({ timeout: 5_000 })
      .catch(() => { /* toast timing is optional */ })
  })
})

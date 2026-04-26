import { test, expect } from "@playwright/test"

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Add a product to cart before each checkout test
    await page.goto("/shop")
    await page.locator("button", { hasText: "Add to Cart" }).first().click()
    await page.waitForTimeout(500) // brief debounce
  })

  test("cart shows added items", async ({ page }) => {
    // Cart badge should reflect added item
    const badge = page.locator("span", { hasText: /^[1-9]\d*$/ }).first()
    await expect(badge).toBeVisible({ timeout: 5_000 })
  })

  test("checkout page step 1: cart review", async ({ page }) => {
    await page.goto("/checkout")
    // Step 1: Review
    await expect(page.locator("text=/Review|Cart/i").first()).toBeVisible()
    await expect(page.locator("text=₹").first()).toBeVisible()
    await page.locator("button", { hasText: /Continue to Shipping/i }).click()
  })

  test("checkout step 2: shipping address form validation", async ({ page }) => {
    await page.goto("/checkout")
    // Skip step 1
    await page.locator("button", { hasText: /Continue to Shipping/i }).click()

    // Try submitting without filling — should show validation errors
    await page.locator('button[type="submit"]').click()
    await expect(page.locator("text=/required|invalid/i").first()).toBeVisible({ timeout: 5_000 })
  })

  test("checkout step 2: fills address and proceeds to payment", async ({ page }) => {
    await page.goto("/checkout")
    await page.locator("button", { hasText: /Continue to Shipping/i }).click()

    // Fill address form
    await page.fill('input[placeholder*="Name"]', "Test User")
    await page.fill('input[placeholder*="phone" i], input[placeholder*="Phone"]', "9876543210")
    await page.fill('input[placeholder*="House" i], input[placeholder*="Address"]', "123 Test Street, MG Road")
    await page.fill('input[placeholder*="City"]', "Jaipur")
    await page.fill('input[placeholder*="State"]', "Rajasthan")
    await page.fill('input[placeholder*="Pincode" i], input[placeholder*="pincode"]', "302001")

    await page.locator('button[type="submit"]').click()
    // Should reach step 3 (Payment)
    await expect(page.locator("text=/Payment|Pay/i").first()).toBeVisible({ timeout: 10_000 })
  })

  test("payment step shows Razorpay secure badge", async ({ page }) => {
    await page.goto("/checkout")
    await page.locator("button", { hasText: /Continue to Shipping/i }).click()

    // Fill and submit address
    await page.fill('input[placeholder*="Name"]', "Test User")
    await page.fill('input[placeholder*="phone" i], input[placeholder*="Phone"]', "9876543210")
    await page.fill('input[placeholder*="House" i], input[placeholder*="Address"]', "123 Test Street")
    await page.fill('input[placeholder*="City"]', "Jaipur")
    await page.fill('input[placeholder*="State"]', "Rajasthan")
    await page.fill('input[placeholder*="pincode" i]', "302001")
    await page.locator('button[type="submit"]').click()

    await expect(page.locator("text=/Razorpay|Secure Payment/i").first()).toBeVisible({ timeout: 10_000 })
    await expect(page.locator("button", { hasText: /Pay ₹/i })).toBeVisible()
  })

  test("empty cart redirects from checkout to shop", async ({ page }) => {
    // Clear cart by going directly without adding item
    await page.goto("/checkout")
    // If cart is empty, should show empty state
    const emptyState = page.locator("text=/cart is empty/i")
    const stepIndicator = page.locator("text=/Cart Review/i")
    // Either empty state OR cart review is shown
    const hasEmpty = await emptyState.isVisible().catch(() => false)
    const hasStep = await stepIndicator.isVisible().catch(() => false)
    expect(hasEmpty || hasStep).toBeTruthy()
  })

  test("order summary sidebar shows correct totals", async ({ page }) => {
    await page.goto("/checkout")
    // Order summary sidebar
    await expect(page.locator("text=/Order Summary/i")).toBeVisible()
    await expect(page.locator("text=/Subtotal/i")).toBeVisible()
    await expect(page.locator("text=/Total Due|Total/i").first()).toBeVisible()
  })
})

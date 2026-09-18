import { test, expect, devices } from '@playwright/test'

const { defaultBrowserType: _ignored, ...PIXEL_5_SAFE } = devices['Pixel 5']

test.use({ ...PIXEL_5_SAFE })

test.describe('Mobile-specific tests (Pixel 5 viewport)', () => {

  test('home page loads without horizontal scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const overflowsHorizontally = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth
    })

    expect(overflowsHorizontally).toBe(false)
  })

  test('hero text is visible and readable on mobile', async ({ page }) => {
    await page.goto('/')

    // H1 hero heading should be visible
    const heroH1 = page.locator('h1').first()
    await expect(heroH1).toBeVisible()

    // Check it contains "Zanzibar" text
    await expect(heroH1).toContainText(/Zanzibar/i)
  })

  test('header renders without overflowing on mobile', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Header width should not exceed viewport
    const headerBox = await header.boundingBox()
    const viewportWidth = page.viewportSize()?.width ?? 393

    if (headerBox) {
      expect(headerBox.width).toBeLessThanOrEqual(viewportWidth + 1) // +1 for rounding
    }
  })

  test('FREE CLASS button is accessible on mobile', async ({ page }) => {
    await page.goto('/')

    const freeBtn = page.getByRole('button', { name: /FREE CLASS|DARASA BURE/i }).first()
    await expect(freeBtn).toBeVisible()

    // Button should be within the viewport horizontally
    const btnBox = await freeBtn.boundingBox()
    const viewportWidth = page.viewportSize()?.width ?? 393

    if (btnBox) {
      expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(viewportWidth + 2)
    }
  })

  test('contact form is fully functional on mobile', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /FREE CLASS|DARASA BURE/i }).first().click()

    // Form should appear
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
    await expect(page.getByPlaceholder('+255 000 000 000')).toBeVisible()

    // Fill in the form
    await page.getByPlaceholder('Your name').fill('Amina Mobile')
    await page.getByPlaceholder('+255 000 000 000').fill('+255628000099')

    await page.getByRole('button', { name: /Book my free class/i }).click()

    // Success state should appear
    await expect(page.getByText('Asante! Request received.')).toBeVisible()
  })

  test('WhatsApp bubble is visible and does not cover the submit button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /FREE CLASS|DARASA BURE/i }).first().click()

    const waBubble = page.locator('a[title="WhatsApp us"]')
    await expect(waBubble).toBeVisible()

    // Get positions
    const submitBtn = page.getByRole('button', { name: /Book my free class/i })
    const submitBox = await submitBtn.boundingBox()
    const waBox = await waBubble.boundingBox()

    if (submitBox && waBox) {
      // Check they don't significantly overlap (allow small overlap tolerance)
      const submitBottom = submitBox.y + submitBox.height
      const waTop = waBox.y

      // WhatsApp bubble should be below the submit button on the page,
      // or not overlapping it
      const overlapsVertically =
        waBox.y < submitBox.y + submitBox.height &&
        waBox.y + waBox.height > submitBox.y

      const overlapsHorizontally =
        waBox.x < submitBox.x + submitBox.width &&
        waBox.x + waBox.width > submitBox.x

      // They should not fully overlap
      const fullyOverlaps = overlapsVertically && overlapsHorizontally
      expect(fullyOverlaps).toBe(false)
    }
  })

  test('WhatsApp bubble is visible on home page mobile', async ({ page }) => {
    await page.goto('/')
    const waBubble = page.locator('a[title="WhatsApp us"]')
    await expect(waBubble).toBeVisible()
  })

  test('location names are readable on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll down to see location section
    await page.evaluate(() => window.scrollTo(0, 600))

    // Key location names should appear somewhere on the page
    await expect(page.getByText('Stone Town').first()).toBeVisible()
  })
})

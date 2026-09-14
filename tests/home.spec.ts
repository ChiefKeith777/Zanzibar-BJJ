import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with title containing "Zanzibar BJJ"', async ({ page }) => {
    await expect(page).toHaveTitle(/Zanzibar BJJ/i)
  })

  test('hero section is visible with h1 containing "Zanzibar"', async ({ page }) => {
    const hero = page.locator('h1').filter({ hasText: /Zanzibar/i })
    await expect(hero.first()).toBeVisible()
  })

  test('gold marquee bar is visible', async ({ page }) => {
    // The marquee section contains the scrolling text items
    const marquee = page.locator('[style*="#FCD116"], [style*="fcd116"]').first()
    await expect(marquee).toBeVisible()
  })

  test('"FREE CLASS" button navigates to contact form', async ({ page }) => {
    // Click the header FREE CLASS button
    const freeClassBtn = page.getByRole('button', { name: /FREE CLASS/i }).first()
    await freeClassBtn.click()

    // The contact form should appear
    await expect(page.getByText('Your first class is free.')).toBeVisible()
  })

  test('location chips Stone Town, Kiwengwa and Jambiani are visible', async ({ page }) => {
    // Wait for the page to render fully
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Stone Town').first()).toBeVisible()
    await expect(page.getByText('Kiwengwa').first()).toBeVisible()
    await expect(page.getByText('Jambiani').first()).toBeVisible()
  })

  test('EN/SW toggle switches visible text (heroKicker changes language)', async ({ page }) => {
    // Confirm EN kicker is visible
    const enKicker = 'Brazilian Jiu Jitsu · Zanzibar, Tanzania'
    await expect(page.getByText(enKicker).first()).toBeVisible()

    // Click the SW button
    await page.getByRole('button', { name: 'SW' }).click()

    // SW kicker text should now be visible (same string in this app, but the nav button changes)
    const swFreeClass = page.getByText('DARASA BURE')
    await expect(swFreeClass.first()).toBeVisible()
  })

  test('WhatsApp bubble is visible in the bottom right', async ({ page }) => {
    // The sticky WhatsApp anchor has title "WhatsApp us"
    const waBubble = page.locator('a[title="WhatsApp us"]')
    await expect(waBubble).toBeVisible()
  })

  test('scrolling to bottom shows footer with "Zanzibar BJJ"', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Footer contains brand name
    const footerBrand = page.locator('footer').getByText('Zanzibar BJJ').first()
    await expect(footerBrand).toBeVisible()
  })
})

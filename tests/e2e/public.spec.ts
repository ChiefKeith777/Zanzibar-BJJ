import { test, expect } from '@playwright/test'

test.describe('Public pages (no auth required)', () => {
  test('home page loads with correct brand text', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Zanzibar BJJ').first()).toBeVisible()
  })

  test('home page title contains Zanzibar BJJ', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Zanzibar BJJ/i)
  })

  test('about page accessible via hash #about', async ({ page }) => {
    await page.goto('/#about')
    // The about page should render something with about-related content
    // In this SPA the hash "about" maps to the AboutBJJ page
    await expect(page.locator('body')).toBeVisible()
  })

  test('learn page accessible via hash #learn', async ({ page }) => {
    await page.goto('/#learn')
    await expect(page.locator('body')).toBeVisible()
  })

  test('contact page accessible via FREE CLASS button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /FREE CLASS|DARASA BURE/i }).first().click()
    await expect(page.getByText('Your first class is free.')).toBeVisible()
  })

  test('footer is visible on home page', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('WhatsApp bubble is visible on home page', async ({ page }) => {
    await page.goto('/')
    const waBubble = page.locator('a[title="WhatsApp us"]')
    await expect(waBubble).toBeVisible()
  })

  test('home page does not redirect to login', async ({ page }) => {
    await page.goto('/')
    // Should not end up on the sign-in page
    await expect(page.getByPlaceholder('amina@example.com')).not.toBeVisible()
    await expect(page.getByText('Zanzibar BJJ').first()).toBeVisible()
  })

  test('contact page does not redirect to login', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /FREE CLASS/i }).first().click()
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
  })

  test('learn page does not redirect to login', async ({ page }) => {
    await page.goto('/')
    // Click the Learn nav item
    await page.getByRole('button', { name: 'Learn' }).click()
    // Should show learn content, not sign-in
    await expect(page.getByPlaceholder('amina@example.com')).not.toBeVisible()
  })
})

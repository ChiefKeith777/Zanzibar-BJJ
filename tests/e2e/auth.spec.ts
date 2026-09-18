import { test, expect } from '@playwright/test'

test.describe('Auth / Sign-in page', () => {
  async function goToSignIn(page: import('@playwright/test').Page) {
    await page.goto('/')
    await page.getByRole('button', { name: /Sign in/i }).click()
  }

  test('sign in page renders with email and password fields', async ({ page }) => {
    await goToSignIn(page)
    await expect(page.getByPlaceholder('amina@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('clicking Sign In without credentials shows nothing broken (form validates)', async ({ page }) => {
    await goToSignIn(page)
    // Submit with empty fields — form should still be present, no crash
    await page.locator('form').getByRole('button').click()
    await expect(page.getByPlaceholder('amina@example.com')).toBeVisible()
  })

  test('Google button is visible', async ({ page }) => {
    await goToSignIn(page)
    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect(googleBtn).toBeVisible()
  })

  test('Sign In tab renders correctly', async ({ page }) => {
    await goToSignIn(page)
    const signInBtn = page.getByRole('button', { name: /^Sign in$/i }).first()
    await expect(signInBtn).toBeVisible()
  })

  test('Sign Up tab renders correctly', async ({ page }) => {
    await goToSignIn(page)
    // "Not a member yet?" leads to sign up
    await expect(page.getByText(/Not a member yet/i)).toBeVisible()
  })

  test('#admin hash shows login gate (not dashboard) when not authenticated', async ({ page }) => {
    await page.goto('/#admin')
    // Without auth, should show sign in or home — not the admin dashboard
    const signInPresent = await page.getByPlaceholder('amina@example.com').isVisible().catch(() => false)
    const homePresent   = await page.getByText('Zanzibar BJJ').first().isVisible().catch(() => false)
    expect(signInPresent || homePresent).toBeTruthy()
  })

  test('"Forgotten your password?" link is visible', async ({ page }) => {
    await goToSignIn(page)
    await expect(page.getByText(/Forgotten your password/i)).toBeVisible()
  })

  test('"Not a member yet?" text is visible', async ({ page }) => {
    await goToSignIn(page)
    await expect(page.getByText(/Not a member yet/i)).toBeVisible()
  })

  test('"Staff access" button is visible', async ({ page }) => {
    await goToSignIn(page)
    await expect(page.getByRole('button', { name: /Staff access/i })).toBeVisible()
  })

  test('back to home: clicking the logo brand button navigates to home', async ({ page }) => {
    await goToSignIn(page)
    await page.getByRole('button', { name: /zanzibar bjj/i }).first().click()
    await expect(page.getByText(/FREE CLASS/i).first()).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Auth / Sign-in page', () => {
  async function goToSignIn(page: import('@playwright/test').Page) {
    await page.goto('/')
    await page.getByRole('button', { name: /Sign in/i }).click()
  }

  test('sign in page renders email and password inputs', async ({ page }) => {
    await goToSignIn(page)
    await expect(page.getByPlaceholder('amina@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('"Sign in" submit button is present', async ({ page }) => {
    await goToSignIn(page)
    // There will be a submit button with the sign in label
    const signInButtons = page.getByRole('button', { name: /^Sign in$/i })
    await expect(signInButtons.first()).toBeVisible()
  })

  test('entering wrong credentials shows error message', async ({ page }) => {
    await goToSignIn(page)

    // Fill in wrong credentials
    await page.getByPlaceholder('amina@example.com').fill('wrong@example.com')
    await page.getByPlaceholder('••••••••').fill('badpassword')

    // Click the submit button (the button element with "Sign in" text)
    await page.locator('form').getByRole('button').click()

    await expect(
      page.getByText(/We could not match those details/i)
    ).toBeVisible()
  })

  test('correct demo credentials navigate away from sign in', async ({ page }) => {
    await goToSignIn(page)

    await page.getByPlaceholder('amina@example.com').fill('amina@example.com')
    await page.getByPlaceholder('••••••••').fill('OSS2026')

    await page.locator('form').getByRole('button').click()

    // Should navigate away from the sign-in page — sign in heading no longer present
    await expect(page.getByText(/^Sign in$/i).first()).not.toBeVisible({ timeout: 5000 })
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

    // Click the FREE CLASS button in the header to go back to contact page,
    // or navigate directly to home via the logo button in the header
    await page.getByRole('button', { name: /zanzibar bjj/i }).first().click()

    // Hero should be visible again
    await expect(page.getByText(/FREE CLASS/i).first()).toBeVisible()
  })
})

/**
 * Admin dashboard E2E tests.
 *
 * Requires env vars:
 *   SUPABASE_TEST_ADMIN_EMAIL    — email of a test admin account
 *   SUPABASE_TEST_ADMIN_PASSWORD — password of the test admin account
 *
 * All tests are skipped when those vars are not set.
 */
import { test, expect } from '@playwright/test'

const adminEmail    = process.env['SUPABASE_TEST_ADMIN_EMAIL']
const adminPassword = process.env['SUPABASE_TEST_ADMIN_PASSWORD']
const hasCredentials = !!(adminEmail && adminPassword)

test.describe('Admin dashboard (requires test credentials)', () => {
  test.skip(!hasCredentials, 'SUPABASE_TEST_ADMIN_EMAIL and SUPABASE_TEST_ADMIN_PASSWORD not set')

  test('login as admin and expect admin dashboard with tab navigation', async ({ page }) => {
    if (!adminEmail || !adminPassword) return

    await page.goto('/')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await page.getByPlaceholder('amina@example.com').fill(adminEmail)
    await page.getByPlaceholder('••••••••').fill(adminPassword)
    await page.locator('form').getByRole('button').click()

    // Wait for admin dashboard to appear
    await page.waitForTimeout(3000)

    // Admin dashboard should have tab navigation visible
    const dashboardVisible = await page.getByText(/admin|dashboard|members|overview/i).isVisible().catch(() => false)
    expect(dashboardVisible).toBeTruthy()
  })
})

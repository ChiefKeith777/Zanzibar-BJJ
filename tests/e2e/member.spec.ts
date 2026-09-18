/**
 * Member portal E2E tests.
 *
 * Requires env vars:
 *   SUPABASE_TEST_MEMBER_EMAIL    — email of a test member account
 *   SUPABASE_TEST_MEMBER_PASSWORD — password of the test member account
 *
 * All tests are skipped when those vars are not set.
 */
import { test, expect } from '@playwright/test'

const memberEmail    = process.env['SUPABASE_TEST_MEMBER_EMAIL']
const memberPassword = process.env['SUPABASE_TEST_MEMBER_PASSWORD']
const hasCredentials = !!(memberEmail && memberPassword)

test.describe('Member portal (requires test credentials)', () => {
  test.skip(!hasCredentials, 'SUPABASE_TEST_MEMBER_EMAIL and SUPABASE_TEST_MEMBER_PASSWORD not set')

  test('login as member and expect pending screen OR member portal', async ({ page }) => {
    if (!memberEmail || !memberPassword) return

    await page.goto('/')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await page.getByPlaceholder('amina@example.com').fill(memberEmail)
    await page.getByPlaceholder('••••••••').fill(memberPassword)
    await page.locator('form').getByRole('button').click()

    // Depending on account state, expect member portal or pending screen
    await page.waitForURL(/.*(#member|#pending).*/, { timeout: 10000 }).catch(() => {
      // URL may not change if hash routing — just check content
    })

    const memberPortal = await page.getByText(/Member portal|My portal/i).isVisible().catch(() => false)
    const pendingScreen = await page.getByText(/pending|approval|complete your profile/i).isVisible().catch(() => false)

    expect(memberPortal || pendingScreen).toBeTruthy()
  })
})

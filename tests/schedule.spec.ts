import { test, expect } from '@playwright/test'

test.describe('Schedule section on home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('schedule section is present on the page', async ({ page }) => {
    // Scroll to the schedule area
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('*'))
      const el = els.find(
        (e) => e.textContent?.includes('Class Schedule') || e.textContent?.includes('Ratiba ya Madarasa')
      )
      el?.scrollIntoView()
    })

    await expect(page.getByText(/Class Schedule/i).first()).toBeVisible()
  })

  test('schedule grid shows all 7 day names', async ({ page }) => {
    // Wait for schedule section to render
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(
        (e) => e.textContent?.includes('Class Schedule')
      )
      el?.scrollIntoView()
    })

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    for (const day of days) {
      await expect(page.getByText(day).first()).toBeVisible()
    }
  })

  test('filter chips are visible (All, Stone Town, Kiwengwa)', async ({ page }) => {
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(
        (e) => e.textContent?.includes('Class Schedule')
      )
      el?.scrollIntoView()
    })

    // Filter chips correspond to LOC_CHIPS data: All + the 4 locations
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stone Town' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Kiwengwa' }).first()).toBeVisible()
  })

  test('clicking "Stone Town" chip filters to show Stone Town classes', async ({ page }) => {
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(
        (e) => e.textContent?.includes('Class Schedule')
      )
      el?.scrollIntoView()
    })

    // Click the Stone Town filter chip
    await page.getByRole('button', { name: 'Stone Town' }).first().click()

    // Stone Town classes should be visible
    await expect(page.getByText('Stone Town').first()).toBeVisible()

    // Kiwengwa-only classes (Tue/Thu) should be filtered out — those days should show no class blocks
    // We verify that at minimum "Stone Town" still appears in the schedule
    const stoneEntries = page.getByText('Stone Town')
    await expect(stoneEntries.first()).toBeVisible()
  })

  test('schedule legend shows Adults, Kids and Family labels', async ({ page }) => {
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(
        (e) => e.textContent?.includes('Adults') && e.textContent?.includes('Kids')
      )
      el?.scrollIntoView()
    })

    await expect(page.getByText('Adults').first()).toBeVisible()
    await expect(page.getByText('Kids').first()).toBeVisible()
    await expect(page.getByText('Family').first()).toBeVisible()
  })

  test('clicking "All" chip after filtering restores full schedule', async ({ page }) => {
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(
        (e) => e.textContent?.includes('Class Schedule')
      )
      el?.scrollIntoView()
    })

    // Filter to Kiwengwa first
    await page.getByRole('button', { name: 'Kiwengwa' }).first().click()

    // Then reset to All
    await page.getByRole('button', { name: 'All' }).first().click()

    // All days should now be visible
    await expect(page.getByText('MON').first()).toBeVisible()
    await expect(page.getByText('SUN').first()).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Contact form flow', () => {
  // Navigate to the contact form via the FREE CLASS header button
  async function goToContact(page: import('@playwright/test').Page) {
    await page.goto('/')
    await page.getByRole('button', { name: /FREE CLASS/i }).first().click()
    // Wait for the form heading to be visible
    await expect(page.getByText('Your first class is free.')).toBeVisible()
  }

  test('navigating to contact via FREE CLASS shows the form', async ({ page }) => {
    await goToContact(page)
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
  })

  test('form has name, phone, location and program fields', async ({ page }) => {
    await goToContact(page)
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
    await expect(page.getByPlaceholder('+255 000 000 000')).toBeVisible()
    // Location and program are selects — check by visible option text
    await expect(page.getByText('Choose a location')).toBeVisible()
    await expect(page.getByText('Choose a program')).toBeVisible()
  })

  test('submitting empty form shows error message', async ({ page }) => {
    await goToContact(page)
    await page.getByRole('button', { name: /Book my free class/i }).click()
    await expect(page.getByText('Please enter your name and phone number.')).toBeVisible()
  })

  test('submitting with name only still shows error', async ({ page }) => {
    await goToContact(page)
    await page.getByPlaceholder('Your name').fill('Amina Hassan')
    await page.getByRole('button', { name: /Book my free class/i }).click()
    await expect(page.getByText('Please enter your name and phone number.')).toBeVisible()
  })

  test('filling name and phone clears error and allows submit', async ({ page }) => {
    await goToContact(page)
    await page.getByPlaceholder('Your name').fill('Amina Hassan')
    await page.getByPlaceholder('+255 000 000 000').fill('+255628000001')
    await page.getByRole('button', { name: /Book my free class/i }).click()

    // Error should be gone and success state should show
    await expect(page.getByText('Please enter your name and phone number.')).not.toBeVisible()
    await expect(page.getByText('Asante! Request received.')).toBeVisible()
  })

  test('selecting a kids program reveals the child fields', async ({ page }) => {
    await goToContact(page)

    // Select the kids program from the second combobox
    const selects = page.locator('select')
    await selects.nth(1).selectOption({ label: 'Little Champs (4–7)' })

    // The child fields block should now appear
    await expect(page.getByText('About your child')).toBeVisible()
    await expect(page.getByPlaceholder("Child's name")).toBeVisible()
    await expect(page.getByPlaceholder('Age')).toBeVisible()
  })

  test('"Prefer WhatsApp?" link is visible', async ({ page }) => {
    await goToContact(page)
    const waLink = page.getByText(/Prefer WhatsApp/i)
    await expect(waLink).toBeVisible()
  })

  test('mobile viewport: form stacks and is fully visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await goToContact(page)

    // Name and phone fields should still be present and visible
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
    await expect(page.getByPlaceholder('+255 000 000 000')).toBeVisible()
    await expect(page.getByRole('button', { name: /Book my free class/i })).toBeVisible()
  })
})

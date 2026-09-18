import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.test if present — provides test credentials without committing them
config({ path: resolve(__dirname, '.env.test') })

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3456',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
      },
    },
  ],
  webServer: {
    command: 'cd web && npm run dev -- --port 3456',
    url: 'http://localhost:3456',
    reuseExistingServer: !process.env.CI,
  },
})

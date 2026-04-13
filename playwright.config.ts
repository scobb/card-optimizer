import { defineConfig } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8788'

export default defineConfig({
  testDir: './test/smoke',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Desktop Chrome', use: { browserName: 'chromium' } },
  ],
})

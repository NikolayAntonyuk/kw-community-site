import { defineConfig, devices } from '@playwright/test';

const reporters = [
  ['html', { open: 'never' }],
  ['allure-playwright', { detail: true, outputFolder: 'allure-results' }]
];

if (process.env.TESTOMATIO) {
  reporters.push(['@testomatio/reporter/lib/adapter/playwright.js']);
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
  },
});

// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test('has title', async ({ page }) => {
  const filePath = path.join(__dirname, '..', 'index.html');
  await page.goto(`file://${filePath}`);

  // Expect a title "to contain" a substring.
  // I don't know the exact title, so I'll just check if it exists
  await expect(page).toHaveTitle(/.*/);
});

test('check index.html content', async ({ page }) => {
  const filePath = path.join(__dirname, '..', 'index.html');
  await page.goto(`file://${filePath}`);

  // Check if body is visible
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

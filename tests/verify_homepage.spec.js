const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Homepage Redesign Verification', () => {
  test.beforeEach(async ({ page }) => {
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);
  });

  test('should look correct with light theme and have all elements', async ({ page }) => {
    await expect(page).toHaveTitle(/Zero Forwarder/);

    await page.screenshot({ path: '.sisyphus/evidence/task-2-homepage-desktop.png', fullPage: true });
    
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    const features = page.locator('#features');
    await expect(features).toBeVisible();
    
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(9);
    
    const docs = page.locator('#docs');
    await expect(docs).toBeVisible();
    
    const install = page.locator('#install');
    await expect(install).toBeVisible();
    
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
  });

  test('copy button should function correctly', async ({ page, context }) => {
    const copyBtn = page.locator('.copy-btn');
    
    await copyBtn.scrollIntoViewIfNeeded();
    
    const initialText = await copyBtn.textContent();
    expect(initialText).toContain('复制');
    
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await copyBtn.click();
    
    await expect(copyBtn).toHaveText('已复制!');
    
    await expect(copyBtn).toHaveCSS('background-color', 'rgb(16, 185, 129)');
    
    await page.waitForTimeout(2100);
    await expect(copyBtn).toHaveText('复制');
  });
});

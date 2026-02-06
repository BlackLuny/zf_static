const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Docs Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const filePath = 'file://' + path.resolve(__dirname, '../docs.html');
    await page.goto(filePath);
    await page.waitForSelector('.nav-item');
  });

  test('should filter document list by title', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('安装');
    
    await page.waitForTimeout(500);
    
    const installDoc = page.locator('.nav-link-item:has-text("安装指南")');
    await expect(installDoc).toBeVisible();
    
    const introDoc = page.locator('.nav-link-item:has-text("项目介绍")');
    await expect(introDoc).not.toBeVisible();
  });

  test('should show all documents when search is cleared', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    
    await searchInput.fill('安装');
    await searchInput.fill('');
    
    const introDoc = page.locator('.nav-link-item:has-text("项目介绍")');
    await expect(introDoc).toBeVisible();
    
    const installDoc = page.locator('.nav-link-item:has-text("安装指南")');
    await expect(installDoc).toBeVisible();
  });

  test('should show "无结果" when no matches found', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    
    await searchInput.fill('xyznonexistentterm');
    
    const noResults = page.locator('#no-search-results');
    await expect(noResults).toBeVisible();
    await expect(noResults).toHaveText('无结果');
    
    const categories = page.locator('.nav-category');
    const visibleCategoriesCount = await categories.evaluateAll(nodes => 
      nodes.filter(n => n.style.display !== 'none').length
    );
    expect(visibleCategoriesCount).toBe(0);
  });

  test('should clear search and show all on ESC key', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    
    await searchInput.fill('安装');
    await searchInput.focus();
    await page.keyboard.press('Escape');
    
    await expect(searchInput).toHaveValue('');
    
    const introDoc = page.locator('.nav-link-item:has-text("项目介绍")');
    await expect(introDoc).toBeVisible();
  });

  test('should capture screenshot of search functionality', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('配置');
    
    await page.waitForTimeout(500);
    
    const fs = require('fs');
    if (!fs.existsSync('.sisyphus/evidence')) {
      fs.mkdirSync('.sisyphus/evidence', { recursive: true });
    }
    
    await page.screenshot({ path: '.sisyphus/evidence/task-6-docs-search.png' });
  });
});

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Navigation and Anchor Links', () => {
  test.beforeEach(async ({ page }) => {
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);
  });

  const anchors = [
    { name: '产品特性', href: '#features', id: 'features' },
    { name: '定价方案', href: '#pricing', id: 'pricing' },
    { name: '用户评价', href: '#testimonials', id: 'testimonials' },
    { name: '常见问题', href: '#faq', id: 'faq' },
    { name: '加入社区', href: '#community', id: 'community' },
    { name: '文档中心', href: '#docs', id: 'docs' },
    { name: '快速开始', href: '#install', id: 'install' }
  ];

  for (const anchor of anchors) {
    test(`should scroll to ${anchor.id} when clicking "${anchor.name}" link`, async ({ page }) => {
      const link = page.locator(`a[href="${anchor.href}"]`).first();
      await link.click();
      
      await page.waitForTimeout(1000);
      
      const section = page.locator(`#${anchor.id}`);
      await expect(section).toBeInViewport();
    });
  }

  test('should navigate to docs.html when clicking "文档" link', async ({ page }) => {
    const docsLink = page.locator('a[href="docs.html"]').first();
    await docsLink.click();
    
    await expect(page).toHaveURL(/docs.html/);
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Mobile Hamburger Menu', () => {
    test.beforeEach(async ({ page }) => {
        // Load the local index.html file
        const filePath = path.resolve(__dirname, '../index.html');
        await page.goto(`file://${filePath}`);
    });

    test('should show hamburger menu and hide nav links on mobile (375px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Hamburger should be visible
        const hamburger = page.locator('.hamburger-menu');
        await expect(hamburger).toBeVisible();
        
        // Nav links should not be visible in viewport or have active class
        const navLinks = page.locator('.nav-links');
        await expect(navLinks).not.toHaveClass(/active/);
        
        // Take screenshot closed
        await page.screenshot({ path: '.sisyphus/evidence/task-3-mobile-menu-closed.png' });
    });

    test('should open menu when hamburger is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        const hamburger = page.locator('.hamburger-menu');
        const navLinks = page.locator('.nav-links');
        
        await hamburger.click();
        
        // Check for active class
        await expect(navLinks).toHaveClass(/active/);
        await expect(hamburger).toHaveClass(/active/);
        
        // Take screenshot open
        await page.screenshot({ path: '.sisyphus/evidence/task-3-mobile-menu-open.png' });
        
        // Check if links are visible
        const firstLink = navLinks.locator('.nav-link').first();
        await expect(firstLink).toBeVisible();
    });

    test('should close menu when a link is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        const hamburger = page.locator('.hamburger-menu');
        const navLinks = page.locator('.nav-links');
        
        await hamburger.click();
        await expect(navLinks).toHaveClass(/active/);
        
        const firstLink = navLinks.locator('.nav-link').first();
        await firstLink.click();
        
        await expect(navLinks).not.toHaveClass(/active/);
    });

    test('tablet layout (768px) check', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        
        // At 768px, it is the max-width for mobile, so it should show hamburger
        const hamburger = page.locator('.hamburger-menu');
        await expect(hamburger).toBeVisible();
        
        await page.screenshot({ path: '.sisyphus/evidence/task-3-tablet-layout.png' });
    });

    test('desktop layout (1024px) check', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 768 });
        
        // Hamburger should be hidden
        const hamburger = page.locator('.hamburger-menu');
        await expect(hamburger).not.toBeVisible();
        
        // Nav links should be visible normally
        const navLinks = page.locator('.nav-links');
        await expect(navLinks).toBeVisible();
        
        // Check it is not fixed position (default is static)
        const position = await navLinks.evaluate((el) => getComputedStyle(el).position);
        expect(position).toBe('static');
    });
});

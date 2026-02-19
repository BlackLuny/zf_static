const { test, expect } = require('@playwright/test');
const path = require('path');

test('verify new sections and FAQ', async ({ page }) => {
  const filePath = path.resolve(__dirname, '../index.html');
  await page.goto(`file://${filePath}`);
  
  // Wait for body to be visible
  await expect(page.locator('body')).toBeVisible();

  // 1. Verify Pricing
  const pricing = page.locator('#pricing');
  await expect(pricing).toBeVisible();
  await expect(pricing.locator('.pricing-card')).toHaveCount(3);
  await pricing.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await pricing.screenshot({ path: '.sisyphus/evidence/task-4-pricing.png' });
  
  // 2. Verify Testimonials
  const testimonials = page.locator('#testimonials');
  await expect(testimonials).toBeVisible();
  await expect(testimonials.locator('.testimonial-card')).toHaveCount(3);
  await testimonials.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await testimonials.screenshot({ path: '.sisyphus/evidence/task-4-testimonials.png' });
  
  // 3. Verify FAQ
  const faq = page.locator('#faq');
  await expect(faq).toBeVisible();
  await faq.scrollIntoViewIfNeeded();
  
  const firstQuestion = faq.locator('.faq-question').first();
  const firstAnswer = faq.locator('.faq-answer').first();
  
  // Initial state: closed
  await expect(faq.locator('.faq-item').first()).not.toHaveClass(/active/);
  
  // Click to expand
  await firstQuestion.click();
  await page.waitForTimeout(500); // Wait for transition
  await expect(faq.locator('.faq-item').first()).toHaveClass(/active/);
  
  // Take screenshot of open FAQ
  await faq.screenshot({ path: '.sisyphus/evidence/task-4-faq-open.png' });
  
  // Click to collapse
  await firstQuestion.click();
  await page.waitForTimeout(500);
  await expect(faq.locator('.faq-item').first()).not.toHaveClass(/active/);
  
  // 4. Verify Community
  const community = page.locator('#community');
  await expect(community).toBeVisible();
  await expect(community.locator('.community-link')).toHaveCount(3);
  await community.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await community.screenshot({ path: '.sisyphus/evidence/task-4-community.png' });
});

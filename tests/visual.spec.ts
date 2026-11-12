import { expect, test } from '@playwright/test';

test('desktop: capture the full experience and check browser errors', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build a workspace/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Not sure where to start/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('desktop-full.png'), fullPage: true, animations: 'disabled' });
  await page.getByRole('tab', { name: /03 Accessories/ }).click();
  await page.getByRole('button', { name: /34” Curved Monitor/ }).click();
  await expect(page.getByRole('img', { name: /ultrawide/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('desktop-accessories.png'), fullPage: true, animations: 'disabled' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('mobile: capture responsive layout without horizontal scroll', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Not sure where to start/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('mobile-full.png'), fullPage: true, animations: 'disabled' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: /Not sure where to start/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /Code & build/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /A cozy corner/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /Keep it practical/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: /Meet The Deep Work Desk/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('mobile-finder.png'), fullPage: true, animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('comparison scenes use unique SVG paint IDs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Not sure where to start/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /Code & build/ }).click();
  await dialog.getByRole('button', { name: /Room to spread out/ }).click();
  await dialog.getByRole('button', { name: /More screen space/ }).click();
  await expect(dialog.getByRole('heading', { name: /Meet The Deep Work Desk/ })).toBeVisible();
  const ids = await page.locator('svg.workspace-svg defs [id]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('id'))
  );
  expect(ids.length).toBeGreaterThan(15);
  expect(new Set(ids).size).toBe(ids.length);
});

test('reduced-motion users can still build and review a workspace', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'Evening' }).click();
  await page.getByRole('button', { name: 'Review my setup' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

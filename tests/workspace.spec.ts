import { expect, test } from '@playwright/test';

test('configure desks, chairs and accessories and review the rental summary', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build a workspace/ })).toBeVisible();
  await page.getByRole('button', { name: /Dual-Motor Pro Desk/ }).click();
  await expect(page.getByRole('img', { name: /dual motor desk/i })).toBeVisible();
  await page.getByRole('tab', { name: /02 Chair/ }).click();
  await page.getByRole('button', { name: /Comfort Office Chair/ }).click();
  await page.getByRole('tab', { name: /03 Accessories/ }).click();
  await page.getByRole('button', { name: /Smart Desk Lamp/ }).click();
  await page.getByRole('button', { name: 'Review my setup' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Dual-Motor Pro Desk')).toBeVisible();
  await expect(dialog.getByText('Comfort Office Chair')).toBeVisible();
  await expect(dialog.getByText('Smart Desk Lamp')).toBeVisible();
  await expect(dialog.getByText(/not a real checkout/i)).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Browse rentals at monis.rent/ })).toHaveAttribute('href', 'https://www.monis.rent');
});

test('presets, sit/stand, lighting, and shared URL all work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /The Creator/ }).click();
  await expect(page.getByRole('img', { name: /dual motor desk at sit height/i })).toBeVisible();
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'Evening' }).click();
  await expect(page.getByRole('img', { name: /dual motor desk at stand height.*evening lighting/i })).toBeVisible();
  await page.goto('/?desk=dual&chair=comfort&extras=ultrawide%2Clamp&plan=week');
  await page.getByRole('tab', { name: /02 Chair/ }).click();
  await expect(page.getByRole('button', { name: /Comfort Office Chair/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: /03 Accessories/ }).click();
  await expect(page.getByRole('button', { name: /34” Curved Monitor/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /27” 4K Monitor/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Weekly' })).toHaveAttribute('aria-pressed', 'true');
});

test('review dialog restores focus and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const review = page.getByRole('button', { name: 'Review my setup' });
  await review.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(review).toBeFocused();
});

test('mobile configurator stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build a workspace/ })).toBeVisible();
  await page.getByRole('tab', { name: /03 Accessories/ }).click();
  await page.getByRole('button', { name: /Desk Plant/ }).click();
  await page.getByRole('button', { name: 'Review my setup' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});


test('guided finder explains a recommendation and updates the live scene', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Not sure where to start/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: /What does your day look like/ })).toBeVisible();
  await dialog.getByRole('button', { name: /Design & create/ }).click();
  await dialog.getByRole('button', { name: /Room to spread out/ }).click();
  await dialog.getByRole('button', { name: /More screen space/ }).click();
  await expect(dialog.getByRole('heading', { name: /Meet The Creative Flow/ })).toBeVisible();
  await expect(dialog.getByText('Why this fits')).toBeVisible();
  await expect(dialog.getByText('RECOMMENDED', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: /Build this workspace/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('img', { name: /dual motor desk.*ultrawide/ })).toBeVisible();
  await page.getByRole('tab', { name: /03 Accessories/ }).click();
  await expect(page.getByRole('button', { name: /34” Curved Monitor/ })).toHaveAttribute('aria-pressed', 'true');
});

test('finder can go backwards without losing its previous answers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Not sure where to start/i }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /Code & build/ }).click();
  await dialog.getByRole('button', { name: /A cozy corner/ }).click();
  await dialog.getByRole('button', { name: /Keep it practical/ }).click();
  await expect(dialog.getByText(/The Deep Work Desk/)).toBeVisible();
  await dialog.getByRole('button', { name: /Adjust my answers/ }).click();
  await expect(dialog.getByRole('heading', { name: /What matters most/ })).toBeVisible();
  await dialog.getByRole('button', { name: /All-day comfort/ }).click();
  await expect(dialog.getByText(/The Deep Work Desk/)).toBeVisible();
});

test('customer can download their workspace summary as a PNG', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Review my setup' }).click();
  const dialog = page.getByRole('dialog');
  const transfer = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Save image' }).click();
  const download = await transfer;
  expect(download.suggestedFilename()).toBe('my-bali-workspace.png');
  await expect(dialog.getByRole('status')).toContainText('downloaded');
});

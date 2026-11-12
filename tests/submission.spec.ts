import { expect, test } from '@playwright/test';

test('a customized workspace survives a reload without an account', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Chair' }).click();
  await page.getByRole('button', { name: /Comfort Office Chair/ }).click();
  await page.getByRole('tab', { name: 'Accessories' }).click();
  await page.getByRole('button', { name: /Desk Plant/ }).click();
  await page.getByRole('button', { name: 'Weekly' }).click();
  await page.reload();
  await page.getByRole('tab', { name: 'Chair' }).click();
  await expect(page.getByRole('button', { name: /Comfort Office Chair/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Accessories' }).click();
  await expect(page.getByRole('button', { name: /Desk Plant/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Weekly' })).toHaveAttribute('aria-pressed', 'true');
});

test('valid shared links take precedence over a previously saved workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Chair' }).click();
  await page.getByRole('button', { name: /Comfort Office Chair/ }).click();
  await page.goto('/?desk=dual&chair=mesh&extras=lamp&plan=week');
  await expect(page.getByRole('img', { name: /dual motor desk/ })).toBeVisible();
  await page.getByRole('tab', { name: 'Chair' }).click();
  await expect(page.getByRole('button', { name: /Ergonomic Mesh Chair/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Accessories' }).click();
  await expect(page.getByRole('button', { name: /Smart Desk Lamp/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /27” 4K Monitor/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Weekly' })).toHaveAttribute('aria-pressed', 'true');
});

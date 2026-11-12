import { expect, test } from '@playwright/test';

test('the first workspace paint has complete desk geometry', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const leg = page.getByTestId('desk-left-leg');
  await expect(leg).toHaveAttribute('d', 'M195 341L223 345L218 494L194 493Z');
  await expect(page.getByRole('img', { name: /electric desk at sit height/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('initial-scene.png'), animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('desk geometry still transitions between sit and stand', async ({ page }) => {
  await page.goto('/');
  const leg = page.getByTestId('desk-left-leg');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(leg).toHaveAttribute('d', 'M195 283L223 287L218 494L194 493Z');
  await expect(page.getByRole('img', { name: /stand height/ })).toBeVisible();
  await page.getByRole('button', { name: 'Sit', exact: true }).click();
  await expect(leg).toHaveAttribute('d', 'M195 341L223 345L218 494L194 493Z');
});

import { expect, test } from '@playwright/test';

test('product-first hierarchy is readable and free of extra promotional sections', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1,name:'Build a workspace in Bali'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Your workspace'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Choose equipment'})).toBeVisible();
  expect(await page.locator('h1').count()).toBe(1);
  expect(await page.locator('.announcement, .intro-stats, .how-strip, .insight-panel').count()).toBe(0);
  const typography = await page.evaluate(() => ({
    body: parseFloat(getComputedStyle(document.body).fontSize),
    title: parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize),
    product: parseFloat(getComputedStyle(document.querySelector('.card-details > strong')!).fontSize),
    details: parseFloat(getComputedStyle(document.querySelector('.card-details > small')!).fontSize),
    weight: getComputedStyle(document.querySelector('h1')!).fontWeight,
  }));
  expect(typography.body).toBeGreaterThanOrEqual(15);
  expect(typography.title).toBeGreaterThanOrEqual(28);
  expect(typography.product).toBeGreaterThanOrEqual(15);
  expect(typography.details).toBeGreaterThanOrEqual(13);
  expect(Number(typography.weight)).toBeLessThanOrEqual(600);
});

test('composition favors the workspace preview over secondary interface', async ({ page }, testInfo) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const stage = await page.locator('.workspace-stage').boundingBox();
  const selection = await page.locator('.config-column').boundingBox();
  expect(stage).not.toBeNull();
  expect(selection).not.toBeNull();
  expect(stage!.width).toBeGreaterThan(selection!.width);
  await page.screenshot({path:testInfo.outputPath('unslop-desktop.png'),fullPage:true,animations:'disabled'});
});

test('simple layout remains usable on 320px phones and 768px tablets', async ({ page }, testInfo) => {
  for(const width of [320,375,390,768,1024]) {
    await page.setViewportSize({width,height:844});
    await page.goto('/');
    await expect(page.getByRole('button',{name:'Review my setup'})).toBeVisible();
    await page.getByRole('tab',{name:'Accessories'}).click();
    await page.getByRole('button',{name:/34” Curved Monitor/}).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(1);
    if(width===320||width===390) {
      await page.screenshot({path:testInfo.outputPath(`unslop-mobile-${width}.png`),fullPage:true,animations:'disabled'});
    }
  }
});

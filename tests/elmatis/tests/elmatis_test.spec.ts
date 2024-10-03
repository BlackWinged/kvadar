import { test, expect, chromium } from '@playwright/test';

test('check all links', async ({ page }) => {
  await page.goto('https://elmatis.hr/');
  // Get all the links on the page
  const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
  

  for (const link of links) {
    try {
        console.log(`Opening URL: ${link}`);
       
        await page.goto(link);
        // You can perform additional actions here if needed

    } catch (error) {
        console.error(`Failed to open URL: ${link}`, error);
    }
}
  
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

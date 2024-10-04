import { test, expect, chromium } from '@playwright/test';

const NavigationLinkDirectory = {};

test('check all links', async ({ page }) => {
  await page.goto('https://elmatis.hr/');
  // Get all the links on the page

  const loc = await page.locator('a');
  const links = await loc.evaluateAll(anchors => anchors.map(x => x.getAttribute("href")));


  await GrabAllLinks(links, page);

});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


async function GrabAllLinks(startingLinks, page) {
  for (const link of startingLinks) {
    if (!(await link in NavigationLinkDirectory)) {
      try {
        console.log(`Opening URL: ${link}`);
        
        const pageLoc = await page.locator("[href='"+ link + "']");

        await pageLoc.click();
        const loc = await page.locator('a');
        const links = await loc.evaluateAll(anchors => anchors.map(x => x.getAttribute("href")));

        const filteredLinks = links.filter(x => x in NavigationLinkDirectory);
        NavigationLinkDirectory[link.href] = 1;
        if (filteredLinks.len > 0) {
          GrabAllLinks(filteredLinks, page);
        }
      } catch (error) {
        console.error(`Failed to open URL: ${link.href}`, error);
      }
    }
  }
}
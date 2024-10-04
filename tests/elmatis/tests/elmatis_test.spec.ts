import { test, expect, chromium } from '@playwright/test';

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
  for (let link of startingLinks) {
    if (link != "#" && !link.includes("http") && !link.includes("ShoppingCart")) {
      try {
        console.log(`Opening URL: ${link}`);

        if (link.includes("javascript") && link.includes("aspx")){
          link = link.split("'")[1];
        } else if (link.includes("javascript")){
          continue;
        }

        await page.goto("https://elmatis.hr/" + link);
        let loc = await page.locator('a');
        let links = await loc.evaluateAll(anchors => anchors.map(x => x.getAttribute("href")));

        for (let newLink of links){
          if (!startingLinks.includes(newLink)){
            startingLinks.push(newLink);
          }
        }

        // let filteredLinks = links.filter(x => !(x in NavigationLinkDirectory));
        // NavigationLinkDirectory[link] = 1;
        // if (filteredLinks.length > 0) {
        //   GrabAllLinks(filteredLinks, page);
        // }
      } catch (error) {
        console.error(`Failed to open URL: ${link.href}`, error);
      }
    }
  }
}
import { test, expect, chromium } from '@playwright/test';
import fs from "node:fs";

test('check all links', async ({ page }) => {

  test.setTimeout(7200000);

  await page.goto('https://elmatis.hr/');
  // Get all the links on the page


  let newlinks: string[] = [];

  if (fs.existsSync('links.txt')) {
    const data = fs.readFileSync('links.txt', 'utf8');
    if (data.length > 10)
      newlinks = JSON.parse(data)
  }

  const loc = await page.locator('a');
  let links = await loc.evaluateAll(anchors => anchors.map(x => x.getAttribute("href")));
  if (newlinks.length == 0) {

    links = await GrabAllLinks(links, page);

    fs.appendFile('links.txt', JSON.stringify(links), err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully

      }
    });

  } else {
    links = newlinks;
  }

  await GetAllContent(links, page);
  // await GetAllContent(["ProductDetails.aspx?productId=57273"], page);

});


async function GrabAllLinks(startingLinks, page) {
  for (let link of startingLinks) {
    if (link != "#" && !link.includes("http") && !link.includes("ShoppingCart")) {
      try {
        console.log(`Opening URL: ${link}`);

        if (link.includes("javascript") && link.includes("aspx")) {
          link = link.split("'")[1];
        } else if (link.includes("javascript")) {
          continue;
        }

        await page.goto("https://elmatis.hr/" + link);
        let loc = await page.locator('a');
        let links = await loc.evaluateAll(anchors => anchors.map(x => x.getAttribute("href")));

        for (let newLink of links) {
          if (!startingLinks.includes(newLink)) {
            startingLinks.push(newLink);
          }
        }

        // if (startingLinks.length > 5000){
        //   break;
        // }

      } catch (error) {
        console.error(`Failed to open URL: ${link.href}`, error);
      }
    }
  }


  return startingLinks;
}

async function GetAllContent(links, page) {
  var i = 0;
  interface ResultType {
    Image: "",
    Name: "",
    Description: "",
    Category: ""
  }

  var content: ResultType[] = [];

  for (let link of links) {
    if (link.includes("ProductDetails.aspx") && !link.includes("ShoppingCart")) {
      console.log(`Scraping URL: ${link}`);
      if (link.includes("javascript") && link.includes("aspx")) {
        link = link.split("'")[1];
      } else if (link.includes("javascript")) {
        continue;
      }
      await page.goto("https://elmatis.hr/" + link);
      let hasContent = await page.isVisible(".content");
      var resultObject: ResultType = {} as ResultType;

      if (hasContent) {
        var nameDiv = await page.locator(".titleMain");
        resultObject.Name = await nameDiv.evaluate(x => x.innerText);

        var contentDiv = await page.locator(".content");

        try {
          var imageDiv = await contentDiv.locator("img");
          resultObject.Image = await imageDiv.evaluate(x => x.getAttribute("src"), null, { timeout: 50 });
        } catch (error) {
          console.error(`No element: img`, error);
        }
        try {
          var categoryDiv = await contentDiv.locator("p");
          resultObject.Category = await categoryDiv.evaluate(x => x.innerHTML, null, { timeout: 50 });
        } catch (error) {
          console.error(`No element: p`, error);
        }

        try {
          var descriptionDiv = await contentDiv.locator("pre");
          resultObject.Description = await descriptionDiv.evaluate(x => x.innerHTML, null, { timeout: 50 });;
        } catch (error) {
          console.error(`No element: pre`, error);
        }

        content.push(resultObject);
      }
      if (i == 50) {
        fs.appendFile('test.txt', JSON.stringify(content), err => {
          if (err) {
            console.error(err);
          } else {
            // file written successfully

          }
        });
        content = [];
        i = 0;
      }
      i++;
    }

    if (content.length > 0) {
      fs.appendFile('test.txt', JSON.stringify(content), err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully

        }
      });
    }
  }
}
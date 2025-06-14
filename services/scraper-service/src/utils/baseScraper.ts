import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { insertJobs } from "../utils/database";
import { FlexibleScraperProps } from "../types/scraper";

puppeteer.use(StealthPlugin());

export const scrapeCompanies = async ({
  url,
  parentSelector,
  companyNameSelector,
  companyDescriptionSelector,
  companyLogoUrlSelector,
  companyLocationSelector,
  websiteSelector,
}: FlexibleScraperProps) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Infinite scroll handling
  let previousHeight;
  for (let i = 0; i < 100; i++) {
    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await new Promise((res) => setTimeout(res, 3000));
    console.log(`Scrolling... Iteration: ${i + 1}`);

    const newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === previousHeight) {
      console.log("No more content to load.");
      break;
    }
  }

  // Pass the selectors and extraction logic to the browser context
  const companies = await page.evaluate(
    (parentSel, nameSel, descSel, logoSel, locSel, webSel) => {
      // Define the extraction helper function inside the browser context
      const extractData = (element: Element, config: any): string | null => {
        // Handle empty selector (use parent element)
        if (!config.selector && config.attribute) {
          if (config.attribute === "href") {
            return (
              (element as HTMLAnchorElement).href ||
              element.getAttribute("href")
            );
          }
          return (
            (element as any)[config.attribute] ||
            element.getAttribute(config.attribute)
          );
        }

        const selectors = [
          config.selector,
          ...(config.fallbackSelectors || []),
        ].filter(Boolean);

        for (const selector of selectors) {
          const found = element.querySelector(selector);
          if (found) {
            if (config.attribute) {
              // Special handling for background-image CSS property
              if (config.attribute === "background-image") {
                const style = window.getComputedStyle(found);
                const bgImage = style.backgroundImage;
                if (bgImage && bgImage !== "none") {
                  // Extract URL from background-image property
                  const match = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
                  return match ? match[1] : null;
                }
                return null;
              }
              return (
                (found as any)[config.attribute] ||
                found.getAttribute(config.attribute)
              );
            }
            return found.textContent?.trim() || null;
          }
        }
        return null;
      };

      const companyElements = document.querySelectorAll(parentSel);
      return Array.from(companyElements).map((el) => {
        const name = extractData(el, nameSel);
        const description = extractData(el, descSel);
        const logoUrl = extractData(el, logoSel);
        const location = extractData(el, locSel);
        const website = extractData(el, webSel);

        return {
          name,
          description,
          location: location || "Remote", // Default to "Remote" if no location
          logoUrl,
          website,
        };
      });
    },
    parentSelector,
    companyNameSelector,
    companyDescriptionSelector,
    companyLogoUrlSelector,
    companyLocationSelector,
    websiteSelector
  );

  // Filter out companies with missing essential data
  const validCompanies = companies.filter(
    (company) => company.name && company.description
  );

  validCompanies.forEach(
    ({ name, description, logoUrl, location, website }) => {
      console.log(`Company: ${name}`);
      console.log(`Description: ${description}`);
      console.log(`Logo url: ${logoUrl}`);
      console.log(`Location: ${location}`);
      console.log(`Website: ${website}`);
      console.log("-----------------------------");
    }
  );

  console.log(`Total companies scraped: ${validCompanies.length}`);

  // Insert into database
  for (const company of validCompanies) {
    await insertJobs({
      companyName: company.name!,
      location: company.location!,
      description: company.description!,
      logoUrl: company.logoUrl || "",
      websiteUrl: company.website || "",
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log(`Inserted company: ${company.name} to database`);
  }

  await browser.close();
};

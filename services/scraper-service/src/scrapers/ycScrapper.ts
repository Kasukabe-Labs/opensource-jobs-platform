import puppeteer from "puppeteer";

const url =
  "https://www.ycombinator.com/companies?regions=Fully%20Remote&regions=India";

export const scrapeYcCompanies = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  let previousHeight;

  for (let i = 0; i < 15; i++) {
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

  const companies = await page.evaluate(() => {
    const companyElements = document.querySelectorAll("._company_i9oky_355");
    return Array.from(companyElements).map((el) => {
      const name = el.querySelector("._coName_i9oky_470")?.textContent?.trim();
      const description = el
        .querySelector("._coDescription_i9oky_495")
        ?.textContent?.trim();
      const location = el
        .querySelector("._coLocation_i9oky_486")
        ?.textContent?.trim();
      const website = el.querySelector("a")?.href;

      return {
        name,
        description,
        location,
        website,
      };
    });
  });

  companies.forEach(({ name, description, location, website }) => {
    console.log(`Company: ${name}`);
    console.log(`Description: ${description}`);
    console.log(`Location: ${location}`);
    console.log(`Website: ${website}`);
    console.log("-----------------------------");
  });
  console.log(`Total companies scraped: ${companies.length}`);

  await browser.close();
};

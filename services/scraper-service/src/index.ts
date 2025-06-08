import { scrapeYcCompanies } from "./scrapers/ycScrapper";

(async () => {
  try {
    await scrapeYcCompanies();
    console.log("✅ Scraping done");
  } catch (err) {
    console.error("❌ Scraping failed", err);
  }
})();

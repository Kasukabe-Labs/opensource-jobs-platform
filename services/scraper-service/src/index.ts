import { weWorkRemotelyConfig } from "./scraperConfigs/WeWorkRemotely";
import { ycombinatorConfig } from "./scraperConfigs/Ycombinator";
import { scrapeCompanies } from "./utils/baseScraper";

(async () => {
  try {
    await scrapeCompanies(weWorkRemotelyConfig);
    console.log("✅ Scraping done");
  } catch (err) {
    console.error("❌ Scraping failed", err);
  }
})();

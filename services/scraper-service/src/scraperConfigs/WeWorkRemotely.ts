import { FlexibleScraperProps } from "../types/scraper";

export const weWorkRemotelyConfig: FlexibleScraperProps = {
  url: "https://weworkremotely.com/top-remote-companies",
  parentSelector: ".jobs-container ul li", // Simpler parent selector
  companyNameSelector: {
    selector: "a:last-child .company", // Relative to the li
    fallbackSelectors: [".company"],
  },
  companyDescriptionSelector: {
    selector: "a:last-child .company-title", // Relative to the li
    fallbackSelectors: [".company-title"],
  },
  companyLogoUrlSelector: {
    selector: ".tooltip--flag-logo .flag-logo", // Relative to the li
    attribute: "background-image",
  },
  websiteSelector: {
    selector: "a:last-child", // Relative to the li
    attribute: "href",
  },
  companyLocationSelector: {
    selector: "", // Default to Remote
  },
};

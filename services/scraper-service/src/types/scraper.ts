export interface ScraperSelector {
  selector: string;
  attribute?: string; // For getting attributes like 'src', 'href', etc.
  fallbackSelectors?: string[]; // Alternative selectors to try
}

export interface FlexibleScraperProps {
  url: string;
  parentSelector: string;
  companyNameSelector: ScraperSelector;
  companyDescriptionSelector: ScraperSelector;
  companyLogoUrlSelector: ScraperSelector;
  companyLocationSelector: ScraperSelector;
  websiteSelector: ScraperSelector;
}

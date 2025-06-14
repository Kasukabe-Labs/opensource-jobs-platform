import { FlexibleScraperProps } from "../types/scraper";

export const ycombinatorConfig: FlexibleScraperProps = {
  url: "https://www.ycombinator.com/companies?regions=Fully%20Remote&regions=India",
  parentSelector: "._company_i9oky_355",
  companyNameSelector: {
    selector: "._coName_i9oky_470",
  },
  companyDescriptionSelector: {
    selector: "._coDescription_i9oky_495",
  },
  companyLogoUrlSelector: {
    selector: "img",
    attribute: "src",
  },
  companyLocationSelector: {
    selector: "._coLocation_i9oky_486",
  },
  websiteSelector: {
    selector: "",
    attribute: "href",
  },
};

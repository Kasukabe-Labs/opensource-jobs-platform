export interface Company {
  id: number;
  name: string;
  slug: string;
  former_names: string[];
  small_logo_thumb_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  isHiring: boolean;
  batch: string;
  status: string;
  industries: string[];
  regions: string[];
  stage: string;
  url: string;
}

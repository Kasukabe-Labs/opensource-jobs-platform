import { Company } from "@/types/company";
import axios from "axios";

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axios.get<Company[]>(
      "https://yc-oss.github.io/api/tags/open-source.json"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw new Error("Failed to fetch companies");
  }
};

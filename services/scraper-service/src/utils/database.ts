import { Pool } from "pg";
import "dotenv/config";
import { Job } from "../types/job";
import { Company } from "../types/company";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

pool.on("connect", () => {
  console.log("Connected to Database");
});

export const insertJobs = async ({
  companyName,
  location,
  description,
  logoUrl,
  tags,
  websiteUrl,
  created_at,
  updated_at,
}: Company): Promise<void> => {
  const query = `
        INSERT INTO companies (name, location, description, logo_url, tags, website_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (name) DO NOTHING
    `;
  const values = [
    companyName,
    location,
    description,
    logoUrl,
    tags,
    websiteUrl,
    created_at || new Date(),
    updated_at || new Date(),
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error inserting job:", error);
    throw error;
  }
};

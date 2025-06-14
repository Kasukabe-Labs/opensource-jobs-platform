import { Pool } from "pg";

console.log("DB_USER:", process.env.DB_USER ? "✓ Loaded" : "✗ Missing");
console.log("DB_HOST:", process.env.DB_HOST ? "✓ Loaded" : "✗ Missing");
console.log("NODE_ENV:", process.env.NODE_ENV);

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to Database");
});

pool.on("error", (err: any) => {
  console.error("Database connection error:", err);
});

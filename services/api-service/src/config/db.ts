import { Pool } from "pg";

// Debug: Check if environment variables are loaded correctly
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

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

pool.on("connect", () => {
  console.log("Connected to Database");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Optional: Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err);
  } else {
    console.log("Database connection test successful:", res.rows[0]);
  }
});

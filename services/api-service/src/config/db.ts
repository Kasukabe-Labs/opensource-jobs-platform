import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jobboard",
  password: "password",
  port: 5432,
});

pool.on("connect", () => {
  console.log("Connected to Database");
});

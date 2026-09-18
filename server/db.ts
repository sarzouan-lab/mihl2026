import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../shared/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const pool = mysql.createPool({
  uri: connectionString,
  connectionLimit: 10,
  charset: "utf8mb4",
});

export const db = drizzle(pool, { schema, mode: "default" });

import pg from "pg";
import { env } from "./env.ts";

const { Pool } = pg

const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
});

export const connectDatabase = async ():Promise<void> => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

export default pool;

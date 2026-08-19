import { Pool } from "pg";
import { nv } from "./env.ts";

const pool = new Pool({
  host: configEnv.database.host,
  port: configEnv.database.port,
  database: configEnv.database.name,
  user: configEnv.database.user,
  password: configEnv.database.password,
});

export const connectDatabase = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

export default pool;

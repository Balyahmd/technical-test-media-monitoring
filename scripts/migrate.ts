import { readFile } from "node:fs/promises";
import pool from "../src/config/database.ts";

const migrate = async (): Promise<void> => {
  try {
    const sql = await readFile(
      "database/migrations/create_mentions.sql",
      "utf-8",
    );

    await pool.query(sql);
    console.log("Migration completed successfully");
    
  } catch (error) {
    console.error("Migration failed");
    throw error;
  } finally {
    await pool.end();
  }
};

migrate().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});

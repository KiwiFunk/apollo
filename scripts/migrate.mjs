import pg from 'pg';
import 'dotenv/config'; // Use dotenv to load environment variables

const { Pool } = pg;

async function createTable() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  console.log("Connected to database.");

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        publish_date DATE,
        category TEXT,
        content TEXT
      );
    `);
    console.log("Table 'notes' is ready. You can now manually add your data.");
  } catch (err) {
    console.error("Failed to create table:", err);
  } finally {
    await client.release();
    await pool.end();
  }
}

createTable();
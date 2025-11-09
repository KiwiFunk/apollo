import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import pg from 'pg';
import 'dotenv/config'; // This loads the .env file

const { Pool } = pg;

async function migrate() {
  // 1. Check for the DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set. Check your .env file.");
  }

  // 2. Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  console.log("Connected to Neon database.");

  try {
    // 3. Create the 'notes' table if it doesn't already exist
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
    console.log("Table 'notes' schema is ready.");

    // 4. Read all files from the src/notes directory
    const notesDir = path.join(process.cwd(), 'src/notes');
    const files = await fs.readdir(notesDir);

    // 5. Loop through each markdown file and insert it into the database
    for (const file of files.filter(f => f.endsWith('.md'))) {
      const filePath = path.join(notesDir, file);
      const rawFileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(rawFileContent); // Separate frontmatter from content
      const slug = file.replace('.md', '');

      // This "UPSERT" query will INSERT new notes, or UPDATE existing ones if the slug matches.
      // This makes the script safe to run multiple times.
      await client.query(
        `INSERT INTO notes (slug, title, description, publish_date, category, content)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           publish_date = EXCLUDED.publish_date,
           category = EXCLUDED.category,
           content = EXCLUDED.content;`,
        [slug, data.title, data.description, data.publishDate, data.category, content]
      );
      console.log(`Migrated: ${file}`);
    }

    console.log("Migration completed successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // 6. Close the database connection
    await client.release();
    await pool.end();
    console.log("Connection closed.");
  }
}

migrate();
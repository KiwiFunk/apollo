import { db } from '../src/db';
import { notes } from '../src/db/schema';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import 'dotenv/config'; // Make sure environment variables are loaded

// ---  PASTE USER ID HERE ---
const TARGET_USER_ID = process.env.USER_ID_FOR_SEEDING || 'PASTE_YOUR_USER_ID_HERE'; 
// -----------------------------------------

// Helper function to create a slug from a filename
const createSlug = (filename: string) => {
  return filename
    .replace(/\.md$/, '') // Remove .md extension
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen between camelCase
    .toLowerCase();
};

async function main() {
  console.log('Starting seed process...');

  if (TARGET_USER_ID === 'PASTE_YOUR_USER_ID_HERE') {
    console.error('Error: Please paste your user ID into the TARGET_USER_ID variable in scripts/seed.ts');
    process.exit(1);
  }

  const seedDir = path.join(process.cwd(), 'dbseed');
  const files = await fs.readdir(seedDir);

  let insertedCount = 0;

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    console.log(`📄 Processing ${file}...`);

    const filePath = path.join(seedDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Use gray-matter to parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    const slug = createSlug(file);

    try {
      await db.insert(notes).values({
        userId: TARGET_USER_ID,
        slug: slug,
        title: frontmatter.title || 'Untitled Note',
        description: frontmatter.description || null,
        publishDate: frontmatter.publishDate ? new Date(frontmatter.publishDate) : new Date(),
        category: frontmatter.category || 'Uncategorized',
        content: content,
      });
      insertedCount++;
      console.log(`Inserted note with slug: ${slug}`);
    } catch (error: any) {
      // Handle cases where a note with the same slug might already exist
      if (error.code === '23505') { // PostgreSQL unique violation error code
        console.warn(`Note with slug "${slug}" already exists. Skipping.`);
      } else {
        console.error(`Failed to insert note ${file}:`, error);
      }
    }
  }

  console.log(`\nSeed process complete! Inserted ${insertedCount} notes.`);
}

main().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});
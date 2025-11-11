import { drizzle } from 'drizzle-orm/postgres-js'; 
import { migrate } from 'drizzle-orm/postgres-js/migrator'; 
import postgres from 'postgres';    // Postgres db driver
import 'dotenv/config';             // Load DATABASE_URL from .env

// Make sure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

// Create a temporary single connection just for running the migration.
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

async function runMigrations() {
  console.log('Connecting to database for migration...');
  // Initialize Drizzle with temp client
  const db = drizzle(migrationClient);

  console.log('Running migrations...');
  /*
    Perform Migrations:
    1. Connect to the database.
    2. Look inside the 'src/db/migrations' folder.
    3. Run any .sql files it finds that haven't been run before. (Tracked in a 'drizzle' table in the DB)
  */
  await migrate(db, { migrationsFolder: 'src/db/migrations' });

  console.log('Migrations completed successfully!');

  // Close the temporary connection
  await migrationClient.end();
  console.log('Connection closed.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
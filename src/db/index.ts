import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

// Create the connection client to the database.
const client = postgres(process.env.DATABASE_URL);

// Create the Drizzle instance, passing it to client and schema.
export const db = drizzle(client, { schema });
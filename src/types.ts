import type { InferSelectModel } from 'drizzle-orm';
import type { notes, users } from './db/schema';

// Inferred directly from Drizzle schema for 'notes'.
export type Note = InferSelectModel<typeof notes>;

// Inferred directly from Drizzle schema for 'users'.
export type User = InferSelectModel<typeof users>;

export interface Frontmatter {
    title: string;
    description: string | null; // description can be null in the DB
    publishDate: string | null; // publishDate can be null in the DB
    category?: string | null; // category can be null in the DB
}

export interface SearchItem {
  title: string;
  description: string;
  category: string;
  slug: string;
  content: string;
}
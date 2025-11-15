/*
  This file is for defining data shapes and stuctures for the application.
*/

import type { InferSelectModel } from 'drizzle-orm';
import type { notes, user } from './db/schema';

// Inferred directly from Drizzle schema for 'notes'.
export type Note = InferSelectModel<typeof notes>;

// Inferred directly from Drizzle schema for 'users'.
export type User = InferSelectModel<typeof user>;

export interface SearchItem {
  title: string;
  description: string;
  category: string;
  slug: string;
  content: string;
}

export interface SelectedNote {
    metadata: {
        title: string;
        publishDate: Date;
        category?: string;
        tags?: string[];
    };
    // Markdown is parsed to HTML by the API route
    htmlContent: string;
}
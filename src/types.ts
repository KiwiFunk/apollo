/*
  This file is for defining data shapes and stuctures for the application.
*/

import type { InferSelectModel } from 'drizzle-orm';
import type { note_metadata, note_content, user } from './db/schema';

// Infer from Drizzle Schema
export type NoteMeta = InferSelectModel<typeof note_metadata>;
export type NoteContent = InferSelectModel<typeof note_content>;
export type User = InferSelectModel<typeof user>;

export type NotesByCategoryMap = Record<string, NoteMeta[]>;

// Stripped/Normalized Metadata for Fuse.js
export interface NormalizedNoteMeta {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    category: string | null;
    //Exclude date/userId since Fuse.js doesn't need them
}

export interface NoteStoreState {
    list: NoteMeta[];                      // Raw data array
    normalizedList: NormalizedNoteMeta[];  // Array optimized for Fuse.js
    categorized: NotesByCategoryMap;       // Mapped by category
}

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
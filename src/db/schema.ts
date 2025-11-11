import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: text('username').unique(),
  hashedPassword: text('hashed_password'),
});

// Sessions Table (Required by Lucia)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

// Notes Table (updated with a userId)
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  publishDate: timestamp('publish_date', { mode: 'date' }),
  category: text('category'),
  content: text('content'),
});
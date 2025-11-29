import { pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// NOTE TABLE DEFINITIONS

// Note Metadata Table (Parent Table)
export const note_metadata = pgTable('note_metadata', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  publishDate: timestamp('publish_date', { mode: 'date' }),
  category: text('category'),
});

// Note Content Table (Child Table enforcing 1:1)
export const note_content = pgTable('note_content', {
  noteId: serial('note_id') 
    .notNull()
    .references(() => note_metadata.id, { onDelete: 'cascade' })
    .primaryKey(), // Ensure 1:1 constraint
  content: text('content'),
});

// Drizzle Helpers for relations
// These definitions are necessary for Drizzle's relational query methods (e.g., .with()).

export const noteMetadataRelations = relations(note_metadata, ({ one }) => ({
  content: one(note_content, {
    fields: [note_metadata.id],
    references: [note_content.noteId],
  }),
}));

export const noteContentRelations = relations(note_content, ({ one }) => ({
  metadata: one(note_metadata, {
    fields: [note_content.noteId],
    references: [note_metadata.id],
  }),
}));

// BETTER-AUTH TABLE DEFINITIONS

// User profile info
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false),
    image: text('image'), // Nullable by default
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    // FK between a session and a user.
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    // FK between an account and a user.
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    // oAuth token specific
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    idToken: text('id_token'),
    // Store HASHED password
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Stores tokens for one-time actions like email verification or password reset.
export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
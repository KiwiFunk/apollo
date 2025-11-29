import type { APIRoute } from 'astro';
import { marked } from 'marked';
import { db } from '../../../db';                   // Import central Drizzle client
import { eq, and } from 'drizzle-orm';              // Import the 'equals' & 'and' operator from Drizzle
import { note_metadata, note_content } from '../../../db/schema'; 

import { generateDesc } from '../../../utils/markdownUtils';        // Import description generator
import { generateUniqueSlug } from '../../../utils/markdownUtils';  // Import unique slug generator

import matter from 'gray-matter';                   // Import to parse YAML frontmatter
import slugify from 'slugify';                      // Create clean URL slugs

// GET single note by slug for the logged in user
export const GET: APIRoute = async ({ params, locals }) => {

    const { slug } = params;    // Get the current slug
    const { user } = locals;    // Get current authenticated user from middleware

    // Check if the user is authed and slug is provided
    if (!user) return new Response("Unauthorized", { status: 401 });
    if (!slug) return new Response("Slug not provided", { status: 400 });

    try {
        // Use the Drizzle relationship helper to join metadata and content 
        const result = await db.query.note_metadata.findFirst({
            where: and(
                eq(note_metadata.slug, slug),       // Match the slug
                eq(note_metadata.userId, user.id)   // Ensures the note belongs to the user
            ),
            // Use relational helper to JOIN note_content table
            with: {
                content: true,                      // Requires the noteMetadataRelations definition in schema.ts
            },
        });

        // Return 404 if note doesn't exist, or doesnt belong to the authenticated user.
        if (!result) {
            return new Response(`Note not found: ${slug}`, { status: 404 });
        }

        // Data structure from Database
        const metadata = result;
        const rawContent = metadata.content?.content || '';     // Access the joined content from nested object
        
        if (!rawContent) {
             return new Response(`Note content is missing for: ${slug}`, { status: 404 });
        }

        // Convert Markdown content to HTML
        const htmlContent = marked(rawContent); // Use marked on the content (Metadata is plain strings)

        const responseData = {
            metadata: {
                title: metadata.title,
                description: metadata.description,
                publishDate: metadata.publishDate ? new Date(metadata.publishDate).toISOString() : null,
                category: metadata.category,
            },
            htmlContent,
        };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

// DELETE single note by slug for the logged in user
export const DELETE: APIRoute = async ({ params, locals }) => {
    
    const { user } = locals;    // Get current user from session cookie
    const { slug } = params;    // Get the note slug from the URL params

    // Auth and Param checks
    if (!user) return new Response("Unauthorized", { status: 401 });
    if (!slug) return new Response("Missing note slug.", { status: 400 });
    try {
        let deletedNoteId: number | null = null;
        
        // DB Transaction (Ensure atomicity)
        await db.transaction(async (tx) => {
            
            // Check the note_metadata table for a match with the queried slug, then get its ID.
            // Also get userId (owner) for authorization check
            const noteToDelete = await tx.query.note_metadata.findFirst({
                columns: { id: true, userId: true },
                where: eq(note_metadata.slug, slug),
            });

            // Return 404 if the slug doesn't exist and rollback transaction
            if (!noteToDelete) {
                tx.rollback(); 
                throw new Response("Note not found.", { status: 404 });
            }

            // Auth Check - Ensure the note belongs to the authenticated user
            if (noteToDelete.userId !== user.id) {
                // Return 403 Forbidden if the user is not the owner
                tx.rollback();
                throw new Response("Forbidden: You do not own this note.", { status: 403 });
            }
            // Set the note ID for deletion
            deletedNoteId = noteToDelete.id;

            // Note_content row will be auto-deleted due to ON DELETE CASCADE constraint
            await tx.delete(note_metadata).where(eq(note_metadata.id, deletedNoteId));
        });

        // 204 No Content is the standard response for a successful DELETE
        return new Response(null, { status: 204 });

    } catch (error) {
        // If the error came from our Response throwing *inside* the transaction
        if (error instanceof Response) {
            return error; 
        }
        // Else
        console.error("Note deletion failed:", error);
        return new Response('Internal Server Error during note deletion.', { status: 500 });
    }
};

/** Update single note by slug for the logged in user (PUT)
 * @param request - The incoming request object containing the updated note data in markdown format
 * @param locals - The locals object containing the authenticated user info
 * @param params - The route parameters containing the note slug to update
 */
export const PUT: APIRoute = async ({ request, locals, params }) => {
    
    const { user } = locals;    // Get current user from session
    const { slug } = params;    // Get url slug from params

    // Auth/Param checks
    if (!user) return new Response("Unauthorized", { status: 401 });
    if (!slug) return new Response("Missing note slug.", { status: 400 });
    
    try {
        const rawBody = await request.text();
        const { data: frontmatter, content: markdownBody } = matter(rawBody);

        // Validate and prepare data
        const title = frontmatter.title?.toString().trim();
        const category = frontmatter.category?.toString().trim() || 'Uncategorized';
        const description = frontmatter.description?.toString().trim() || generateDesc(markdownBody);

        if (!title || title.length < 1) {
            return new Response("Validation Failed: Title is required.", { status: 400 });
        }

        // Database transaction & authorization
        let updatedNoteMeta;

        await db.transaction(async (tx) => {
            
            // Get the existing note from the DB
            const existingNote = await tx.query.note_metadata.findFirst({
                where: eq(note_metadata.slug, slug),
            });

            // If note does not exist, or is not owned by user, perform rollback
            if (!existingNote) {
                tx.rollback(); 
                throw new Response("Note not found.", { status: 404 });
            }

            if (existingNote.userId !== user.id) {
                tx.rollback();
                throw new Response("Forbidden: You do not have permission to edit this note.", { status: 403 });
            }
            
            const noteId = existingNote.id;
            const originalSlug = existingNote.slug;
            let finalSlug = originalSlug;
            
            // IF title has changed, Re-Slugify
            if (title !== existingNote.title) {
                finalSlug = await generateUniqueSlug(originalSlug, db);
            }
            
            // Update note_metadata
            const updatedMetadata = await tx.update(note_metadata)
                .set({
                    title: title,
                    description: description,
                    category: category,
                    slug: finalSlug,
                    publishDate: new Date(), // Update publish date on edit
                })
                .where(eq(note_metadata.id, noteId))
                .returning({ 
                    id: note_metadata.id, 
                    slug: note_metadata.slug, 
                    publishDate: note_metadata.publishDate, 
                    userId: note_metadata.userId // Include userId for the client-side NoteMeta object
                });
            
            // Update note_content
            await tx.update(note_content)
                .set({
                    content: markdownBody,
                })
                .where(eq(note_content.noteId, noteId));
            
            // Prepare data for AJAX response (Match NoteMeta defined in types.ts)
            const meta = updatedMetadata[0];
            updatedNoteMeta = { 
                id: meta.id,
                userId: meta.userId,
                slug: meta.slug,
                title: title,
                description: description,
                publishDate: meta.publishDate.toISOString(),
                category: category,
            };
        });
        
        // 200 OK is standard for a successful PUT/update
        return new Response(JSON.stringify(updatedNoteMeta), {
            status: 200, 
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        if (error instanceof Response) {
            return error; 
        }
        console.error("Note update failed:", error);
        return new Response('Internal Server Error during note update.', { status: 500 });
    }
};
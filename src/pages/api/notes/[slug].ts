import type { APIRoute } from 'astro';
import { marked } from 'marked';
import { db } from '../../../db';                   // Import central Drizzle client
import { note_metadata } from '../../../db/schema'; // Import the main note_metadata table 
import { eq, and } from 'drizzle-orm';              // Import the 'equals' & 'and' operator from Drizzle

// API Route to fetch a note by slug for the authenticated user

// Get locals from context
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
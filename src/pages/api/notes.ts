import type { APIRoute } from 'astro';
import { db } from '../../db';                      // Import central Drizzle client
import { note_metadata } from '../../db/schema';    // Import the main note_metadata table
import { eq, and, desc } from 'drizzle-orm';        // Import Drizzle operators for comparison and sorting

// GET all notes for a logged in user (This fetches only the metadata, not the linked note_content table)
// This Endpoint is no longer used - Dashboard.astro directly queries the DB during server build. 
export const GET: APIRoute = async ({ locals }) => {

    const { user } = locals;                        // Get current authenticated user from middleware

    // Check if the user is authed. If !user, return 401 Unauthorized
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        // Drizzle query to fetch all columns from note_metadata table
        const noteMetadata = await db.select()
            .from(note_metadata)                        // Select from note_metadata table
            .where(eq(note_metadata.userId, user.id))   // Filter results to include ONLY notes owned by the authenticated user
            .orderBy(desc(note_metadata.publishDate));  // Order notes by publish date descending

        // Return array of note metadata objects as JSON response
        return new Response(JSON.stringify(noteMetadata), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Handle any database or runtime errors
        console.error("Error fetching notes metadata:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
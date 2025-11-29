import type { APIRoute } from 'astro';
import { db } from '../../db';          //Import Drizzle Client
import { note_metadata, note_content }; // Import type definitions
import { eq } from 'drizzle-orm';       // Import Drizzle operators
import matter from 'gray-matter';       // Import to parse YAML frontmatter
import slugify from 'slugify';          // Create clean URL slugs

// Function to generate a description from markdown content if none provided
function generateDesc(markdown: string): string | null {
    // Split into lines

    // Collect first non-heading paragraph

    // Handle multi-line paragraph

    // Normalize MD formatting

    // Extract cleaned sentence and return it
}

// Takes in request content, and locals for user context
export const POST: APIRoute = async ({ request, locals }) => {

    // Perform Auth Checks
    const { user } = locals;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        // Store the raw response

        // Split frontmatter from main content body using gray-matter

        // Perform validation on data

        // Generate automated fields (URL Slug, Publish Date etc.)

        // Make sure slug is unique (Prevent routing errors)

        // Send clean data to database

        // Prepare data for AJAX response

        // Return Success Respons

    } catch (error) {
        console.error("Note creation failed: ", error);
        return new Response('Internal Server Error.', { status: 500 });
    }
};

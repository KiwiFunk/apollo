import type { APIRoute } from 'astro';
import { marked } from 'marked';
import { db } from '../../../db';           // Import central Drizzle client
import { notes } from '../../../db/schema'; // Import the notes table schema
import { eq } from 'drizzle-orm';           // Import the 'equals' operator from Drizzle

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;
    if (!slug) {
        return new Response("Slug not provided", { status: 400 });
    }

    try {
        // Use the Drizzle query builder for a type-safe query
        const result = await db.select().from(notes).where(eq(notes.slug, slug)).limit(1);

        if (result.length === 0) {
            return new Response(`Note not found: ${slug}`, { status: 404 });
        }
        
        const note = result[0];                         // The result is already a perfectly typed `Note` object
        const htmlContent = marked(note.content || ''); // Use marked on the content

        const responseData = {
            frontmatter: {
                title: note.title,
                description: note.description,
                // Ensure publishDate is handled correctly if it's null
                publishDate: note.publishDate ? new Date(note.publishDate).toISOString() : null,
                category: note.category,
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
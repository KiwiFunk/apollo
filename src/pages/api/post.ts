import type { APIRoute } from 'astro';
import { db } from '../../db';              // Import Drizzle Client Instance
import { notes } from '../../db/schema';    // Import Notes Table Schema

export const POST: APIRoute = async ({ request, locals }) => {

    // Check for authenticated user
    const { user } = locals;
    if (!user) return new Response("Unauthorized", { status: 401 });

    // Clean Title and Convert to a Slug
    const generateSlug = (title: string) => {
        return title
            .replace(/\s+/g, '-')
            .toLowerCase()
            .trim()
    };

    try {
        // Parse JSON data from request
        const data = await request.json();
        const { title, description, publishDate, category, content } = data;

        // Perform Validation on request data
        if (!title || !content) {
            return new Response(
                JSON.stringify({ error: "Title and content are required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate the slug from the title
        const slug = generateSlug(title);

        // Insert the note into the database using Drizzle
        const [newNote] = await db.insert(notes).values({
            userId: user.id,                                        // Link note to the authenticated user
            slug: slug,
            title: title,
            description: description || null,                               // Optional field
            publishDate: publishDate ? new Date(publishDate) : new Date(),  // Default to now if not provided
            category: category || 'Uncategorized',                          // Default category
            content: content,
        }).returning();  // This returns the newly inserted row

        // Return AJAX response with the new note
        return new Response(
            JSON.stringify({ 
                success: true, 
                note: newNote 
            }),
            { 
                status: 201,  // 201 means "Created"
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error: any) {
        console.error('Error creating note:', error);

        // Handle unique constraint violation (duplicate slug)
        if (error.code === '23505') {
            return new Response(
                JSON.stringify({ error: "A note with this title already exists" }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ error: "Failed to create note" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
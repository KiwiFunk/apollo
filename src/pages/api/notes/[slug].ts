import type { APIRoute } from 'astro';
import { marked } from 'marked';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: import.meta.env.DATABASE_URL });

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;
    if (!slug) return new Response("Slug not provided", { status: 400 });

    try {
        const { rows } = await pool.query('SELECT * FROM notes WHERE slug = $1', [slug]);
        if (rows.length === 0) {
            return new Response(`Note not found: ${slug}`, { status: 404 });
        }
        
        const note = rows[0];
        const htmlContent = marked(note.content);

        const responseData = {
            frontmatter: {
                title: note.title,
                description: note.description,
                publishDate: new Date(note.publish_date).toISOString(),
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
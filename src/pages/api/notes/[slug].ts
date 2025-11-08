import type { APIRoute } from 'astro';
import { marked } from 'marked';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;

    if (!slug) {
        return new Response("Slug not provided", { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'src/notes', `${slug}.md`);
        const rawContent = await fs.readFile(filePath, 'utf-8');
        
        const { data: frontmatter, content } = matter(rawContent);
        const htmlContent = marked(content);

        return new Response(JSON.stringify({ frontmatter, htmlContent }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(`Note not found: ${slug}`, { status: 404 });
    }
};
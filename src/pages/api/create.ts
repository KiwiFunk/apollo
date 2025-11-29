import type { APIRoute } from 'astro';
import { db } from '../../db';          //Import Drizzle Client
import { note_metadata, note_content }; // Import type definitions
import { eq } from 'drizzle-orm';       // Import Drizzle operators
import matter from 'gray-matter';       // Import to parse YAML frontmatter
import slugify from 'slugify';          // Create clean URL slugs

// Function to generate a description from markdown content if none provided
function generateDesc(markdown: string): string {
  // Split into lines
  const lines = markdown.split(/\r?\n/);

  // Collect the first non-heading paragraph (may span multiple lines)
  let paragraph: string[] = [];
  let inParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headings
    if (/^#+\s/.test(trimmed)) continue;

    if (trimmed === "") {
      // End of a paragraph
      if (inParagraph) break;
      else continue;
    }

    // First paragraph start
    if (!inParagraph) {
      inParagraph = true;
    }

    if (inParagraph) {
      paragraph.push(trimmed);
    }
  }

  if (paragraph.length === 0) return "Please add some content at least ;)";

  // Join multi-line paragraph into one string
  let fullParagraph = paragraph.join(" ");

  // --- Strip inline markdown formatting ---
  fullParagraph = fullParagraph
    // Remove bold/italic markers
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    .trim();

  // Extract first sentence ending with ., !, or ?
  const match = fullParagraph.match(/^(.*?[.!?])(\s|$)/);

  return match ? match[1].trim() : fullParagraph;
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
        const rawBody = await request.text();

        // Parse with gray-matter to split frontmatter
        const { data: frontmatter, content: markdownBody } = matter(rawBody);

        // Perform validation on data
        const title = frontmatter.title?.toString().trim();
        const category = frontmatter.category?.toString().trim() || 'Uncategorized';
        const description = frontmatter.description?.toString().trim() || generateDesc(markdownBody);

        if (!title || title.length < 1) {
            return new Response("Validation Failed: Title is required.", { status: 400 });
        }

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

/**
 * Generates a short description from the raw markdown content.
 * It extracts the first sentence of the first non-heading paragraph
 * and strips inline markdown formatting.
 * @param markdown The raw string content of the note body.
 */
export function generateDesc(markdown: string): string {
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

/**
 * Generate a unique slug by checking existing records in the database.
 *
 * @param {string} baseSlug - The initial slug to start with.
 * @param {object} db - Database instance with query capabilities.
 * @returns {Promise<string>} - A unique slug string.
 */
export async function generateUniqueSlug(baseSlug, db) {
    let finalSlug = baseSlug;
    let slugCounter = 0;

    while (true) {
        const existingNote = await db.query.note_metadata.findFirst({
            where: eq(note_metadata.slug, finalSlug),
        });

        if (!existingNote) {
            return finalSlug; // Unique slug found
        }

        slugCounter++;
        finalSlug = `${baseSlug}-${slugCounter}`;
    }
}
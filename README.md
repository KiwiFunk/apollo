# Apollo

Apollo is a simple, fast, and modern markdown-driven knowledge base built with Astro. It's designed to be a personal wiki for viewing notes and articles, featuring a dynamic, app-like user experience.

## Core Technologies

This project leverages a modern web stack to deliver a high-performance, interactive experience:

*   **[Astro](https://astro.build/):** The core web framework. Astro builds a super-fast static shell of the site and uses an "island architecture" to hydrate only the interactive parts, minimizing the amount of JavaScript sent to the browser.

*   **[Preact](https://preactjs.com/):** A lightweight (3kb) alternative to React used to create the interactive "islands" on the page. In this project, it powers the dynamic content display and the search functionality.

*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework used for all styling. The `@tailwindcss/typography` plugin is used to provide sensible default styling for the rendered markdown content.

*   **[Fuse.js](https://fusejs.io/):** A powerful, lightweight fuzzy-search library. It enables the client-side search functionality, allowing you to find notes by title, description, or content.

*   **[Marked](https://marked.js.org/) & [Gray-Matter](https://github.com/jonschlinkert/gray-matter):** These Node.js packages work together on the server. `gray-matter` extracts the frontmatter (metadata like `title`, `category`) from the markdown files, and `marked` parses the markdown content into HTML.

## Key Features

*   **Markdown-Driven:** All content is stored in simple `.md` files in the `src/notes/` directory. Just add a new file to create a new note.

*   **Dynamic Content Loading:** The main content area is a single interactive component. Clicking a note link fetches its content from a dedicated API route and renders it instantly without a full page reload, creating a smooth, single-page application (SPA) feel.

*   **Client-Side Fuzzy Search:** The search bar provides instant, fuzzy search results across all notes. It weighs titles and descriptions more heavily to provide the most relevant results first.

*   **Automatic Categorization:** Notes are automatically grouped in the sidebar based on the `category` field in their frontmatter, making it easy to browse related topics.

*   **Optimized for Performance:** By using Astro's island architecture with `client:idle`, interactive components only load their JavaScript when the browser is idle, ensuring the page is responsive immediately.

## Future Plans

- **Markdown Editor:** Edit Markdown files and create new ones directly from the webapp.

- **User System:** Expand with a simple Auth System.
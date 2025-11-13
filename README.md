# Apollo

Apollo is a simple, fast, and modern markdown-driven knowledge base built with Astro. It's designed to be a personal wiki for viewing notes and articles, featuring a dynamic, app-like user experience.

## Core Technologies

This project leverages a modern web stack to deliver a high-performance, interactive experience:

*   **[Astro](https://astro.build/):** The core web framework. Astro builds a super-fast static shell of the site and uses an "island architecture" to hydrate only the interactive parts, minimizing the amount of JavaScript sent to the browser.

*   **[Preact](https://preactjs.com/):** A lightweight (3kb) alternative to React used to create the interactive "islands" on the page. In this project, it powers the dynamic content display and the search functionality.

*   **[Drizzle ORM](https://orm.drizzle.team/):** A modern, type-safe TypeScript ORM used to interact with the PostgreSQL database. It provides a simple and powerful way to query and manage all application data.

*   **[PostgreSQL](https://www.postgresql.org/):** The robust, open-source relational database that stores all user accounts, sessions, and note data.

*   **[Better Auth](https://www.better-auth.com/):** A flexible authentication library used to handle user registration, login, and session management.

*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework used for all styling. The `@tailwindcss/typography` plugin is used to provide sensible default styling for the rendered markdown content.

*   **[Fuse.js](https://fusejs.io/):** A powerful, lightweight fuzzy-search library. It enables the client-side search functionality, allowing you to find notes by title, description, or content.

*   **[Marked](https://marked.js.org/):** A high-performance markdown parser used to convert the markdown content fetched from the database into HTML for display.


## Key Features

*   **Secure Multi-User System:** Features a complete authentication system for user registration and login. All notes are tied to user accounts, ensuring users can only access their own content.

*   **Database-Driven Content:** All notes are stored securely in a PostgreSQL database, allowing for robust data management and scalability.

*   **Dynamic Content Loading:** The main content area is a single interactive component. Clicking a note link fetches its content from a dedicated API route and renders it instantly without a full page reload, creating a smooth, single-page application (SPA) feel.

*   **Client-Side Fuzzy Search:** The search bar provides instant, fuzzy search results across all of the logged-in user's notes.

*   **Automatic Categorization:** Notes are automatically grouped in the sidebar based on their assigned category, making it easy to browse related topics.

*   **Optimized for Performance:** By using Astro's island architecture, interactive components only load their JavaScript when needed, ensuring the application is responsive and fast.

## Future Plans

- **Markdown Editor:** Implement a client-side editor to create and modify notes directly within the application.
- **Note Sharing:** Allow users to generate public, shareable links for their notes.
- **Social Logins:** Enable authentication via third-party providers like GitHub or Google.
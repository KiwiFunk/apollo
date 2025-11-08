import { useState, useEffect } from 'preact/hooks';
import type { MarkdownInstance } from 'astro'; 
import type { Frontmatter } from '../types';

interface LoadedNote {
    frontmatter: Frontmatter;
    htmlContent: string;
}

export default function DynamicContent({ allNotes }: { allNotes: MarkdownInstance<Frontmatter>[] }) {
    const [activeNote, setActiveNote] = useState<LoadedNote | null>(null);

    const loadNote = async (slug: string) => {
        try {
            const response = await fetch(`/api/notes/${slug}`);
            if (!response.ok) throw new Error('Note not found');
            const noteData: LoadedNote = await response.json();
            setActiveNote(noteData);
        } catch (error) {
            console.error('Failed to load note:', error);
        }
    };

    const handleLinkClick = (event: Event) => {
        event.preventDefault(); // Prevent default page reload behavior
        const link = event.currentTarget as HTMLAnchorElement;
        const url = new URL(link.href);
        const slug = url.pathname.split('/').pop();

        if (slug) {
            // Update the browser's URL without a full navigation
            history.pushState({ slug }, '', url.pathname);
            loadNote(slug);
        }
    };
    
    const handleBackClick = () => {
        history.pushState(null, '', '/');
        setActiveNote(null);
    };

    // useEffect hook runs once when the component "hydrates" in the browser.
    // Set up listeners for external elements.
    useEffect(() => {
        // Function to handle browser back/forward navigation
        const handlePopState = () => {
            const slug = window.location.pathname.split('/').pop();
            if (slug && window.location.pathname.startsWith('/notes/')) {
                loadNote(slug);
            } else {
                setActiveNote(null);
            }
        };

        // Find all links in the static sidebar and attach click handler
        const sidebarLinks = document.querySelectorAll('aside a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Listen for popstate events (back/forward buttons)
        window.addEventListener('popstate', handlePopState);

        // Check the URL when the page first loads to handle deep links
        handlePopState();

        // Handle cleanup on component remove
        return () => {
            window.removeEventListener('popstate', handlePopState);
            sidebarLinks.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
            });
        };
    }, []); // Empty array means effect runs only once on mount.

    if (activeNote) {
        return (
            <article className="prose prose-slate lg:prose-l max-w-5xl mx-auto">
                <button onClick={handleBackClick} className="mb-8 text-indigo-600 hover:underline">
                    &larr; Back to Home
                </button>
                <h1>{activeNote.frontmatter.title}</h1>
                <p className="text-sm text-gray-500">Published on: {activeNote.frontmatter.publishDate}</p>
                <hr className="my-4" />
                <div dangerouslySetInnerHTML={{ __html: activeNote.htmlContent }} />
            </article>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center border-b pb-8 mb-8 border-gray-200">
                <h1 className="text-4xl font-bold text-gray-900">Welcome to your Knowledge Base</h1>
                <p className="mt-2 text-lg text-gray-500">Select a note from the sidebar or find one below to get started.</p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allNotes.map((note) => (
                    <a
                        href={`/notes/${note.file.split("/").pop()?.replace(".md", "")}`}
                        onClick={handleLinkClick} // Links inside Preact use the onClick prop directly
                        className="note-link block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                    >
                        <h3 className="text-xl font-semibold text-gray-900">{note.frontmatter.title}</h3>
                        <p className="mt-2 text-gray-600 line-clamp-3">{note.frontmatter.description}</p>
                        <span className="mt-4 inline-block text-sm font-medium text-indigo-600">Read more &rarr;</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
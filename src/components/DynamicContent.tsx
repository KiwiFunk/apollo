import { useState, useEffect } from 'preact/hooks';
import type { MarkdownInstance } from 'astro'; 
import type { Frontmatter } from '../types';
import HomePage from './HomePage';

interface LoadedNote {
    frontmatter: Frontmatter;
    htmlContent: string;
}

// Dispatch an event to notify of content changes
const dispatchClearSearch = () => {
    const event = new CustomEvent('clear-search');
    window.dispatchEvent(event);
};

export default function DynamicContent({ allNotes, notesByCategory }: { allNotes: MarkdownInstance<Frontmatter>[]; notesByCategory: Record<string, any[]> }) {
    const [activeNote, setActiveNote] = useState<LoadedNote | null>(null);

    const loadNote = async (slug: string) => {
        try {
            const response = await fetch(`/api/notes/${slug}`);
            if (!response.ok) throw new Error('Note not found');
            const noteData: LoadedNote = await response.json();
            setActiveNote(noteData);
            dispatchClearSearch();      // Clear search when a note is loaded
        } catch (error) {
            console.error('Failed to load note:', error);
        }
    };

    const handleLinkClick = (event: Event) => {
        event.preventDefault();         // Prevent default page reload behavior
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
        dispatchClearSearch();          // Clear search when navigating back
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
                dispatchClearSearch();  // Clear search when navigating back
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
        <HomePage allNotes={allNotes} notesByCategory={notesByCategory} handleLinkClick={handleLinkClick} />
    );
}
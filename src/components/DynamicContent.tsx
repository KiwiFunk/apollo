import { useState, useEffect } from 'preact/hooks';

// Define the shape of note and frontmatter data
interface Frontmatter {
    title: string;
    description: string;
    publishDate: string;
    category?: string;
}

interface Note {
    file: string;
    frontmatter: Frontmatter;
}

interface LoadedNote {
    frontmatter: Frontmatter;
    htmlContent: string;
}

export default function DynamicContent({ allNotes }: { allNotes: Note[] }) {
    const [activeNote, setActiveNote] = useState<LoadedNote | null>(null);

    const handlePopState = () => {
        const slug = window.location.pathname.split('/').pop();
        if (slug && window.location.pathname.startsWith('/notes/')) {
            loadNote(slug);
        } else {
            setActiveNote(null);
        }
    };

    useEffect(() => {
        // Listen to browser navigation events
        window.addEventListener('popstate', handlePopState);
        // Set up initial listeners for all note links
        addNoteLinkListeners();
        // Check initial URL on load
        handlePopState();

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const loadNote = async (slug: string) => {
        try {
            const response = await fetch(`/api/notes/${slug}`);
            if (!response.ok) throw new Error('Note not found');
            const noteData: LoadedNote = await response.json();
            setActiveNote(noteData);
        } catch (error) {
            console.error('Failed to load note:', error);
            // You could set an error state here to display a message
        }
    };

    const handleLinkClick = (event: MouseEvent) => {
        event.preventDefault();
        const link = event.currentTarget as HTMLAnchorElement;
        const url = new URL(link.href);
        const slug = url.pathname.split('/').pop();

        if (slug) {
            history.pushState({ slug }, '', url.pathname);
            loadNote(slug);
        }
    };
    
    const handleBackClick = () => {
        history.pushState(null, '', '/');
        setActiveNote(null);
    };

    // Ensures that links rendered by Astro are also interactive
    function addNoteLinkListeners() {
        document.querySelectorAll('aside a, a.note-link').forEach(link => {
            // cast to any to avoid conflicts with the event listener type
            (link as any).onClick = handleLinkClick;
        });
    }

    if (activeNote) {
        return (
            <article className="prose lg:prose-xl max-w-none">
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
        <div>
            <div className="text-center border-b pb-8 mb-8 border-gray-200">
                <h1 className="text-4xl font-bold text-gray-900">Welcome to your Knowledge Base</h1>
                <p className="mt-2 text-lg text-gray-500">Select a note from the sidebar or find one below to get started.</p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allNotes.map((note) => (
                    <a
                        href={`/notes/${note.file.split("/").pop()?.replace(".md", "")}`}
                        onClick={handleLinkClick}
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
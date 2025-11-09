import type { MarkdownInstance } from 'astro';
import type { Frontmatter } from '../types';

// Define the props the component will accept
interface Props {
  allNotes: MarkdownInstance<Frontmatter>[];
  handleLinkClick: (event: Event) => void;
}

// A reusable card component for our notes
const NoteCard = ({ note, handleLinkClick }: { note: MarkdownInstance<Frontmatter>, handleLinkClick: (e: Event) => void }) => (
    <a
        href={`/notes/${note.file.split("/").pop()?.replace(".md", "")}`}
        onClick={handleLinkClick}
        className="note-link block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
    >
        <h3 className="text-xl font-semibold text-gray-900">{note.frontmatter.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{note.frontmatter.description}</p>
        <span className="mt-4 inline-block text-sm font-medium text-indigo-600">Read more &rarr;</span>
    </a>
);


export default function HomePage({ allNotes, handleLinkClick }: Props) {
    // Sort notes by publish date to find the most recent ones
    const recentNotes = [...allNotes]
        .sort((a, b) => new Date(b.frontmatter.publishDate).getTime() - new Date(a.frontmatter.publishDate).getTime())
        .slice(0, 6); // Feature the 6 most recent notes

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center py-16 sm:py-20">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Welcome to Apollo</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">Select a note from the sidebar or find one below to get started.</p>
            </div>

            {/* Recently Updated Section */}
            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recently Updated</h2>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {recentNotes.map((note) => (
                        <NoteCard key={note.url} note={note} handleLinkClick={handleLinkClick} />
                    ))}
                </div>
            </div>
        </div>
    );
}
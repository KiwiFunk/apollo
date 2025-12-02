import type { Note } from '../types';
import { useStore } from '@nanostores/preact';
import { $notesStore } from '../stores/notesStore';

// A reusable card component for our notes
const NoteCard = ({ note }: { note: Note }) => (
    <a
        href={`/notes/${note.slug}`} // Use note.slug directly from the database object
        className="note-link block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
    >
        <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{note.description}</p>
        <span className="mt-4 inline-block text-sm font-medium text-indigo-600">Read more &rarr;</span>
    </a>
);

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: any }) => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600">
            {icon}
        </div>
        <div className="ml-4 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
            <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
    </div>
);

export default function HomePage() {

    // Subscribe to Nanostore
    const noteState = useStore($notesStore);

    // Get data from store
    const userNotes = noteState.list;
    const notesByCategory = noteState.categorized;

    // Sort notes by publish date to find the most recent ones
    const recentNotes = [...userNotes]
        .sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime())
        .slice(0, 6); // Feature the 6 most recent notes

    // Safely get the date of the latest note
    const latestNoteDate = recentNotes.length > 0 && recentNotes[0].publishDate 
        ? new Date(recentNotes[0].publishDate).toLocaleDateString() 
        : 'N/A';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center py-16 sm:py-20">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Welcome to Apollo</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">Select a note from the sidebar or find one below to get started.</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard 
                    label="Total Notes" 
                    value={userNotes.length} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                />
                <StatCard 
                    label="Categories" 
                    value={Object.keys(notesByCategory).length} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>}
                />
                <StatCard 
                    label="Lastest Note" 
                    value={latestNoteDate} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>}
                />
                <StatCard 
                    label="Version" 
                    value="0.9.1" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>}
                />
            </div>

            {/* Recently Updated Section */}
            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recently Updated</h2>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {recentNotes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            </div>
        </div>
    );
}
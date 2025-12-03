import { useRef, useState } from 'preact/hooks';
import Delphi, { type DelphiRef } from './DelphiEditor';
import { addNote } from '../stores/notesStore';

export default function CreateNote() {
    const editorRef = useRef<DelphiRef>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handlePublish = async () => {
        if (!editorRef.current) return;

        const noteData = editorRef.current.getSaveData();
        
        // Check if data exists (Delphi returns null if no changes, though in Create mode it usually returns the default object)
        // Client-side Validation: Ensure Title exists (Better UX than waiting for server 400)
        if (!noteData || !noteData.metadata.title.trim()) {
            alert("Please enter a title before publishing.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const newNoteMeta = await response.json();
            
            // Update Global Store so the sidebar updates immediately
            addNote(newNoteMeta);

            // Redirect to the new note
            window.location.href = `/notes/${newNoteMeta.slug}`;

        } catch (error) {
            console.error("Creation failed:", error);
            alert(`Failed to create note: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6 px-6">
                <h1 className="text-2xl font-bold text-gray-800">Create New Note</h1>
                <button 
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Publishing...' : 'Publish Note'}
                </button>
            </div>
            
            <Delphi ref={editorRef} />
        </div>
    );
}
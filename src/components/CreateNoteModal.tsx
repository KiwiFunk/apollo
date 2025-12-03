import { useRef, useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import Delphi, { type DelphiRef } from './DelphiEditor';
import { addNote, $isCreateModalOpen, setCreateModalOpen } from '../stores/notesStore';

export default function CreateNoteModal() {
    const isOpen = useStore($isCreateModalOpen);
    const editorRef = useRef<DelphiRef>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Close Modal on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) setCreateModalOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

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

            // Close Modal
            setCreateModalOpen(false);

            // Redirect to the new note
            window.location.href = `/notes/${newNoteMeta.slug}`;

        } catch (error) {
            console.error("Creation failed:", error);
            alert(`Failed to create note: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            
            {/* Modal Content */}
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Create New Note</h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setCreateModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Publishing...' : 'Publish Note'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Editor Area */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-4xl mx-auto">
                        <Delphi ref={editorRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
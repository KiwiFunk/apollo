import { useRef, useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import Delphi, { type DelphiRef } from './DelphiEditor';
import { addNote } from '../stores/notesStore';
import { $isCreateModalOpen, setCreateModalOpen } from '../stores/uiStore';

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
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Create New Note</h2>
                    <div className="flex gap-1 lg:gap-3">
                        <button 
                            onClick={() => setCreateModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                        >
                            <span className="flex items-center justify-center">
                                {/* Mobile */}
                                <span className="lg:hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </span>
                                                
                                {/* Desktop */}
                                <span className="hidden lg:inline">Cancel</span>
                            </span>
                            
                        </button>
                        <button 
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <span className="flex items-center justify-center">
                                {/* Mobile */}
                                <span className="lg:hidden">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                        <polyline points="7 3 7 8 15 8 15 3"></polyline>
                                    </svg>
                                </span>
                                                
                                {/* Desktop */}
                                <span className="hidden lg:inline">{isSaving ? 'Publishing...' : 'Publish Note'}</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Editor Area */}
                <div className="flex-1 overflow-y-scroll bg-gray-100">
                    <div className="mx-auto">
                        <Delphi ref={editorRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
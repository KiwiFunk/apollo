import { useEffect, useRef, useState } from 'preact/hooks';
import type { NoteMeta } from '../types.ts'     //POST route returns a NoteMeta object

// Import EasyMDE as WYSIWYG markdown editor
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

// Import addNote for updating Nanostore
import { addNote } from '../stores/notesStore.ts'

export default function NoteEditor() {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const mdeRef = useRef<EasyMDE | null>(null);

    // Guided metadata inputs state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Initialize EasyMDE on mount (runs only on client-side)
    useEffect(() => {
        if (editorRef.current && !mdeRef.current) {
            const mde = new EasyMDE({
                element: editorRef.current,
                initialValue: "Start writing your Markdown content here...",
                spellChecker: false,
                minHeight: '400px',
                toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side"],
            });
            mdeRef.current = mde;
        }

        return () => {
            if (mdeRef.current) {
                mdeRef.current.toTextArea();
                mdeRef.current = null;
            }
        };
    }, []);

    const handleSave = async () => {
        if (!mdeRef.current || !title.trim()) {
            setStatusMessage("Error: Title is required!");
            return;
        }

        setIsSaving(true);
        setStatusMessage('');

        // Assemble raw Markdown string with YAML frontmatter
        const markdownContent = mdeRef.current.value();
        const rawContent = 
        `---
        title: "${title.trim()}"
        description: "${description.trim()}"
        category: "${category.trim()}"
        ---

        ${markdownContent}`;

        try {
            // AJAX POST request
            const response = await fetch('/api/notes/create', {
                method: 'POST',
                // Tell the server we are sending plain text
                headers: { 'Content-Type': 'text/plain' }, 
                body: rawContent,
            });

            if (response.status === 201) {
                const newNoteMeta: NoteMeta = await response.json();
                
                // Update Nanostore (Dynamic UI Update)
                addNote(newNoteMeta); 
                
                setStatusMessage('Note created successfully! Redirecting...');
                
                // Redirect to the newly created note's view
                window.location.href = `/notes/${newNoteMeta.slug}`;
                
            } else {
                const errorText = await response.text();
                setStatusMessage(`Error: ${response.status} - ${errorText || 'Failed to create note.'}`);
            }
        } catch (error) {
            setStatusMessage('Network error during save.');
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full mx-auto p-4 max-w-5xl">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Create New Note</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
                >
                    {isSaving ? 'Saving...' : 'Publish Note'}
                </button>
            </div>
            
            {statusMessage && <div className={`p-3 mb-4 rounded-lg ${statusMessage.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{statusMessage}</div>}

            {/* Guided Metadata Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Title (Required)"
                    value={title}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Category (Optional)"
                    value={category}
                    onInput={(e) => setCategory(e.currentTarget.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Short Description (Optional)"
                    value={description}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>

            {/* Markdown Editor */}
            <textarea ref={editorRef} className="w-full h-96"></textarea>
            
        </div>
    );
}
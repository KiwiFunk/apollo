/**This component is used for Displaying/Editing full note content
 * It is used in the [slug].astro page.
 * Markdown content returned by the API endpoint
 * View displays parsed content from `marked`, Edit displays raw markdown, and submits to PUT route.
 **/
import { useState, useMemo, useRef } from 'preact/hooks';
import { marked } from 'marked';                    // `marked` is used to parse markdown for display
import StatsBar from './StatsBar';                  // Provides bool for View/Edit state
import type { FullNote } from '../types';           // note_metadata + note_content
import Delphi from './DelphiEditor';                // Raw markdown editor component
import type { DelphiRef } from './DelphiEditor';    // Ref type for DelphiEditor
import { updateNote } from '../stores/notesStore';  // Nanostore action to update note metadata

export default function NoteViewer({ note }: { note: FullNote }) {

    // Store Note data in a local state so we can update island with AJAX response after content edit
    const [currentNote, setCurrentNote] = useState<FullNote>(note);

    // Editing bool state passed up from ToggleTab->StatsBar->NoteViewer
    const [isEditing, setIsEditing] = useState(false);

    const handleToggle = () => {
        // If currently editing, save, then toggle
        if (isEditing)handleSave();
        setIsEditing(prev => !prev);
    }

    // Memoize content to prevent re-renders unless changed
    const htmlContent = useMemo(() => {
        // Ensure content exists to prevent crashes
        return currentNote.content ? marked.parse(currentNote.content) as string : '';
    }, [currentNote.content]);

    // Create ref to access DelphiEditor methods
    const editorRef = useRef<DelphiRef>(null);

    // Handle Save Action
    const handleSave = async () => {
        // Only try to save if the editor is actually mounted (ref exists)
        if (editorRef.current) {
            try {
                // Call the function exposed by useImperativeHandle
                const fullNoteData = editorRef.current.getSaveData();

                // If Null was returned, no changes were made
                if (!fullNoteData) {
                    console.log("No changes detected. Skipping save.");
                    return;
                }

                //console.log("Saving Changes...", fullNoteData);

                // Send PUT request to API Route
                const response = await fetch(`/api/notes/${currentNote.metadata.slug}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fullNoteData)
                });

                 // Check for server errors before parsing JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server Error: ${errorText}`);
                }

                // Get NoteMeta object from server Response (For updating Nanostore)
                const updatedMeta = await response.json();

                // Silently update URL if slug changed
                if (updatedMeta.slug !== currentNote.metadata.slug) {
                    const newUrl = `/notes/${updatedMeta.slug}`;
                    window.history.replaceState(null, '', newUrl);
                }

                // Update Local State (Use Delphi Object for markdown content)
                setCurrentNote({
                    metadata: updatedMeta,
                    content: fullNoteData.content
                });

                // Update Note Store (Reflects changes in Sidebar/Nav)
                updateNote(updatedMeta);
                
            } catch (error) {
                console.error("Error saving note:", error);
                alert("Failed to save note.");
            }
        }
    };

    return (
        <div>
            {/* Pass parsed HTML to StatsBar for word count logic */}
            <StatsBar 
                metadata={currentNote.metadata} 
                htmlContent={htmlContent} 
                toggleState={handleToggle} 
            />

            {!isEditing ? (
                // Display parsed HTML from marked
                <article class="prose prose-slate lg:prose-l max-w-5xl mx-auto">                
                    <div class="p-12" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </article>
            ) : (
                // Display Raw Mardown content
                <div class="max-w-5xl mx-auto">
                    <Delphi note={currentNote} ref={editorRef} />
                </div>
            )}
        </div>
    );
}
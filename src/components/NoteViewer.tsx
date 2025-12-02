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
    const handleSave = () => {
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

                // Else update Nanostore and send PUT to API
                console.log("Here is the JSON object:", fullNoteData);
                // TODO: Send FullNote Object to PUT route
            } catch (error) {
                console.error("Error saving note:", error);
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
/**This component is used for Displaying/Editing full note content
 * It is used in the [slug].astro page.
 * Markdown content returned by the API endpoint
 * View displays parsed content from `marked`, Edit displays raw markdown, and submits to PUT route.
 **/
import { useState, useMemo } from 'preact/hooks';
import { marked } from 'marked';                    // `marked` is used to parse markdown for display
import StatsBar from './StatsBar';                  // Provides bool for View/Edit state
import type { FullNote } from '../types';           // note_metadata + note_content
import Delphi from './DelphiEditor';                // Raw markdown editor component

export default function NoteViewer({ note }: { note: FullNote }) {

    // Editing bool state passed up from ToggleTab->StatsBar->NoteViewer
    const [isEditing, setIsEditing] = useState(false);

    // Memoize content to prevent re-renders unless changed
    const htmlContent = useMemo(() => {
        // Ensure content exists to prevent crashes
        return note.content ? marked.parse(note.content) as string : '';
    }, [note.content]);

    return (
        <div>
            {/* Pass parsed HTML to StatsBar for word count logic */}
            <StatsBar 
                metadata={note.metadata} 
                htmlContent={htmlContent} 
                toggleState={setIsEditing} 
            />

            {!isEditing ? (
                // Display parsed HTML from marked
                <article class="prose prose-slate lg:prose-l max-w-5xl mx-auto">                
                    <div class="p-12" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </article>
            ) : (
                // Display Raw Mardown content
                <div class="max-w-5xl mx-auto">
                    <Delphi note={note} />
                </div>
            )}
        </div>
    );
}
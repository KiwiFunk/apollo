import { useEffect } from 'preact/hooks';
import type { NoteMeta } from '../types/note';                      // Import the type for the data
import { $notesStore, setNoteMeta } from '../stores/notesStore';    // Import nanostore and setter function

interface NoteStoreInitializerProps {
  // Server-fetched data received as a prop
  initialData: NoteMeta[];
}

export default function NoteStoreInitializer({ initialData }: NoteStoreInitializerProps) {

    useEffect(() => {
        // Check the store's current state when the component mounts/hydrates
        const currentNoteList = $notesStore.get().list;
        
        if (currentNoteList.length > 0) {
             /* This branch executes during a View Transition, or if another component
             already initialized the store. It correctly returns without running the setter. */
             console.log("[Nanostore] Store already populated. Skipping server data load.");
             return;
        }

        // This branch executes ONLY on a hard page load (when the store is truly empty).
        console.log(`[Nanostore] Initializing with ${initialData.length} notes from server.`);
        
        // Setter function handles normalization and categorization internally.
        setNoteMeta(initialData);
        
    }, [initialData]); // Re-run effect only if initialData changes (e.g., if a page loads new data)

    return null;
}
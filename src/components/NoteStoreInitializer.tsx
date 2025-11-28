import { useEffect, useRef } from 'preact/hooks';
import type { NoteMeta } from '../types/note';                      // Import the type for the data
import { $notesStore, setNoteMeta } from '../stores/notesStore';    // Import nanostore and setter function

interface NoteStoreInitializerProps {
  // Server-fetched data received as a prop
  initialData: NoteMeta[];
}

export default function NoteStoreInitializer({ initialData }: NoteStoreInitializerProps) {
    // Use ref to check if the store has already been populated. 
    // This prevents re-initialization during client-side navigation (e.g., View Transitions).
    const isInitialized = useRef($notesStore.get().list.length > 0);

    useEffect(() => {
        
        if (isInitialized.current) {
            return;
        }

        console.log(`[Nanostore] Initializing with ${initialData.length} notes...`);
        
        // Setter function handles normalization and categorization internally.
        setNoteMeta(initialData);

        // Mark the store as initialized.
        isInitialized.current = true;
        
    }, [initialData]);  // Re-run effect only if initialData changes

    // This component does not render any UI
    return null;
}
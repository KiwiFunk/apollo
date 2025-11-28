import { atom } from 'nanostores';
import type { NoteMeta, NotesByCategoryMap, NormalizedNoteMeta, NoteStoreState } from '../types';

// Store to hold array of user's notes (metadata only)
// This is used to populate navtrees, perform searches, populate index etc
export const $notesStore = atom<NoteStoreState>({
    list: [],
    normalizedList: [],
    categorized: {}
});

/**
 * Helper function to process data and populate the store.
 * This function handles normalization and categorization.
 * * @param data Array of NoteMeta objects fetched from the API
 */
export const setNoteMeta = (data: NoteMeta[]) => {
    
    // Create an object to hold notes categorized by their category
    const categorizedMap = data.reduce(
        (categoryMap: NotesByCategoryMap, note: NoteMeta) => {

            // Determine the category of the note, default to "Uncategorized" if not present
            const category = note.category || "Uncategorized";

            // Initialize the category array if it doesn't exist yet
            if (!categoryMap[category]) {
                categoryMap[category] = [];
            }
            // Add the current note to the appropriate category
            categoryMap[category].push(note);

            return categoryMap;
        },
        {}, // Initial empty object
    );

    // Normalization (For Fuse.js Search)
    // Filter down to only the fields Fuse.js needs to improve search performance.
    const normalizedList: NormalizedNoteMeta[] = data.map(note => ({
        id: note.id,
        slug: note.slug,
        title: note.title,
        description: note.description,
        category: note.category,
    }));

    // Update the Nanostore
    // Set all three calculated properties in the store simultaneously.
    $notesStore.set({
        list: data,
        normalizedList: normalizedList,
        categorized: categorizedMap
    });
}
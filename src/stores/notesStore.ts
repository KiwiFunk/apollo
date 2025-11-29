import { atom } from 'nanostores';
import type { NoteMeta, NotesByCategoryMap, NormalizedNoteMeta, NoteStoreState } from '../types';

// HELPER FUNCTIONS

// Create a lightweight normalized version of NoteMeta for Fuse.js
const normalizeNote = (note: NoteMeta): NormalizedNoteMeta => ({
    id: note.id,
    slug: note.slug,
    title: note.title,
    description: note.description,
    category: note.category,
});

// Group notes into a map keyed by category (or "Uncategorized" if none)
const getCategorizedMap = (data: NoteMeta[]): NotesByCategoryMap => {
    return data.reduce(
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
};

// NANOSTORE ATOM

// Store to hold all user note metadata, optimized for different consumption methods.
export const $notesStore = atom<NoteStoreState>({
    list: [],               // Raw data array
    normalizedList: [],     // Array optimized for Fuse.js
    categorized: {}         // Mapped by category (Used for NavTree etc)
});

// MUTATOR FUNCTIONS

/**
 * Initial SETTER - Sets the initial list of notes from server data, performs all transformations.
 * Used only on hard page load or initial hydration.
 * @param data The full list of NoteMeta objects from the server response.
 */
export const setNoteMeta = (data: NoteMeta[]) => {
    // Sort notes by publish date (newest first)
    const sortedData = data.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    // Process all required transformations
    const categorizedMap = getCategorizedMap(sortedData);
    const normalizedList: NormalizedNoteMeta[] = sortedData.map(normalizeNote);

    // Update the Nanostore state atomically
    $notesStore.set({
        list: sortedData,
        normalizedList: normalizedList,
        categorized: categorizedMap
    });
}

/**
 * ADD NOTE - Adds a newly created note's metadata to the store and updates all 
 * derived lists without requiring a full page refresh.
 * @param newNote The metadata object returned from the API POST request.
 */
export const addNote = (newNote: NoteMeta) => {
    const currentState = $notesStore.get();
    
    // Prepend the new note to the raw list
    const newList = [
        newNote,
        ...currentState.list,
    ];

    // Update 'normalizedList'
    const newNormalizedNote = normalizeNote(newNote);
    const newNormalizedList = [
        newNormalizedNote,
        ...currentState.normalizedList,
    ];
    
    // Update 'categorized' - Update ONLY the affected category array
    const category = newNote.category || 'Uncategorized';
    
    // Deep copy the map to trigger store update
    const newCategorized = { ...currentState.categorized };
    
    // Ensure the category array exists
    if (!newCategorized[category]) {
        newCategorized[category] = [];
    }
    
    // Prepend the new note to the correct category array
    newCategorized[category] = [newNote, ...newCategorized[category]];

    // Update the entire store state atomically
    $notesStore.set({
        list: newList,
        normalizedList: newNormalizedList,
        categorized: newCategorized,
    });
    
    console.log(`[Nanostore] Added new note: "${newNote.title}". Store size: ${newList.length}`);
};
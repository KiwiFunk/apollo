import { atom } from 'nanostores';
import type { NoteMeta } from '../types';

// Store to hold array of user's notes (metadata only)
// This is used to populate navtrees, perform searches, populate index etc
export const $notesStore = atom<NoteMeta[]>([]);

/**
 * Helper function to load and populate store.
 * @param data Array of NoteMeta objects to store
 */
export const setNoteMeta = (data: NoteMeta[]) => {
    $notesStore.set(data);
}
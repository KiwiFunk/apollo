import { useState, useMemo } from 'preact/hooks';

// Define data structures
interface Note {
  url: string | undefined;
  frontmatter: {
    publishDate: string;
    [key: string]: any;
  };
}

interface SortableCategory {
  name: string;
  notes: Note[];
  lastUpdated: number;
}

type SortType = 'alphaAsc' | 'alphaDesc' | 'recent';

// Custom hook
export function useCategorySorter(notesByCategory: Record<string, Note[]>) {
  const [sortType, setSortType] = useState<SortType>('alphaAsc');

  // Transform the prop object into a sortable array.
  // useMemo ensures this only re-calculates if the source data changes.
  const categories = useMemo(() => {
    return Object.entries(notesByCategory).map(([name, notes]) => {
      const lastUpdated = Math.max(
        ...notes.map(note => new Date(note.frontmatter.publishDate).getTime())
      );
      return { name, notes, lastUpdated };
    });
  }, [notesByCategory]);

  // Sort the array whenever the sortType or the base data changes.
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      switch (sortType) {
        case 'alphaDesc':
          return b.name.localeCompare(a.name);
        case 'recent':
          return b.lastUpdated - a.lastUpdated;
        case 'alphaAsc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [sortType, categories]);

  // Cycle through sort types
  const cycleSortType = () => {
    setSortType(current => {
      if (current === 'alphaAsc') return 'alphaDesc';
      if (current === 'alphaDesc') return 'recent';
      return 'alphaAsc';
    });
  };

  return { sortedCategories, sortType, cycleSortType };
}
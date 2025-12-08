import { useState, useMemo, useEffect } from 'preact/hooks';
import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';

// Imports for noteStore
import { useStore } from '@nanostores/preact';
import { $notesStore } from '../stores/notesStore';
import type { NormalizedNoteMeta } from '../types';

// Search Item structure is the same as Normalized Note Data
type SearchItem = NormalizedNoteMeta;

// Define props the component will receive
interface Props {
  searchList: SearchItem[];
}

export default function Search() {

  // Re-render when notesStore changes
  const noteState = useStore($notesStore);

  // Get the normalized list for searching from the global store
  const searchList = noteState.normalizedList;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<SearchItem>[]>([]);

  // Fuse.js Configuration
  const fuse = useMemo(() => {
    const options: IFuseOptions<SearchItem> = {
      keys: [
        { name: 'title', weight: 2 },       // Give title matches more weight
        { name: 'description', weight: 1 },
        { name: 'category', weight: 0.5 },   // Give cat matches less weight
      ],
      includeMatches: true,                 // This is useful for highlighting matches
      minMatchCharLength: 2,
      threshold: 0.4,                       // Adjust this for more/less fuzzy matches (0=perfect, 1=anything)
    };

    // Ensure we only create the Fuse instance if the list has data
    if (searchList.length === 0) {
        return null;
    }

    return new Fuse(searchList, options);
  }, [searchList]);

  // useEffect to listen for clear-search event (useEffect means we only create one listener on component mount)
  useEffect(() => {
    const handleClearSearch = () => {
      setQuery('');
      setResults([]);
    };

    window.addEventListener('clear-search', handleClearSearch);

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener('clear-search', handleClearSearch);
    };
  }, []); // Empty dependency array means this runs only once

  // Debounce the search input to avoid searching on every single keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      // Make sure query is >1 and fuse instance is ready
      if (query.length > 1 && fuse) {
        const searchResults = fuse.search(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    }, 200); // Wait 200ms after the user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [query, fuse]);

  return (
    <div class="relative">

      {/* SVG Search Icon */}
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>

      <input
        id="search"
        name="search"
        type="search"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder="Search notes..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        disabled={searchList.length === 0}
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd" />
          </svg>
        </button>
      )}
      
      {/* Search Results Dropdown */}
      {query.length > 1 && (
        <div className={[
          // Base styles (borders, background, shadow)
          "bg-white border-gray-200 shadow-xl z-50 overflow-y-auto",
          
          // MOBILE STYLES (Fixed positioning, full width)
          "fixed left-4 right-4 top-20 max-h-[60vh] rounded-xl border",
          
          // DESKTOP STYLES (Absolute positioning relative to input, standard dropdown)
          "lg:absolute lg:left-0 lg:right-0 lg:top-full lg:mt-2 lg:max-h-160 lg:w-full lg:rounded-md"
        ].join(' ')}>
          {results.length > 0 ? (
            <ul>
              {results.map(({ item }) => (
                <li key={item.slug} onClick={() => setQuery('')}>
                  <a href={`/notes/${item.slug}`} class="block p-4 hover:bg-indigo-50 transition-colors">
                    <div class="flex justify-between items-center">
                      <span class="font-semibold text-gray-800">{item.title}</span>
                      {/* The category visualization! */}
                      <span class="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{item.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div class="p-4 text-center text-gray-500">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}
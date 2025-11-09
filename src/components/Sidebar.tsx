import { useState, useEffect, useRef } from 'preact/hooks';
import CollapsibleContainer from '../CollapsibleContainer.tsx';

interface SortableCategory {
  name: string;
  notes: any[];
  lastUpdated: number;
}

export default function Sidebar({ notesByCategory }: Props) {

  // Store transformed array of categories
  const [categories, setCategories] = useState<SortableCategory[]>([]);

  // Current Sorted Items for Rendering
  const [sortedCategories, setSortedCategories] = useState<SortableCategory[]>([]);
  const [sortType, setSortType] = useState('alphaAsc');

  // States for sidebar open/close
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null); // Create a ref for the aside element

  // Transform notesByCategory object into an array for easier sorting
  useEffect(() => {
    const sortableData = Object.entries(notesByCategory).map(([name, notes]) => {
      // Calculate a timestamp using the publishDate field
      const lastUpdated = Math.max(
        ...notes.map(note => new Date(note.frontmatter.publishDate).getTime())
      );
      return { name, notes, lastUpdated };
    });
    setCategories(sortableData);
  }, [notesByCategory]); // Only run if prop changes

  // Run whenever sortType  or base data changes
  useEffect(() => {
    const sorted = [...categories].sort((a, b) => {
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
    setSortedCategories(sorted);
  }, [sortType, categories]); // Re-sort when sortType or the underlying data changes

  // Handle Burger Menu Toggle Event
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleContentClick = (e: MouseEvent) => {
    // Check if the clicked element is an <a> tag or is inside one.
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      // Use getComputedStyle instead of classList to check if position is fixed, meaning mobile view
      if (sidebarRef.current && window.getComputedStyle(sidebarRef.current).position === 'fixed') {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    // Listen for the custom event dispatched by the burger button
    window.addEventListener('toggle-sidebar', handleToggle);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
    };
  }, []);

  // Prevent body content scrolling when mobile menu open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    }
  }, [isOpen]);

  // NEW: Function to cycle through sort types
  const cycleSortType = () => {
    if (sortType === 'alphaAsc') setSortType('alphaDesc');
    else if (sortType === 'alphaDesc') setSortType('recent');
    else setSortType('alphaAsc');
  };

  // NEW: Helper to get the current sort icon
  const getSortIcon = () => {
    if (sortType === 'alphaAsc') return 'A-Z';
    if (sortType === 'alphaDesc') return 'Z-A';
    return 'Recent'; // Or an icon for a clock
  };

  return (
    <>
      <aside
        ref={sidebarRef}                // Attach the ref
        onClick={handleContentClick}    // Attach the click handler
        className={[
          "select-none w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6",
          "h-full transition-transform transform",
          "fixed lg:static z-20",
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ].join(' ')}
      >
        {/* Sidebar Controls/Header */}
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Categories</h2>
          
          <button 
            onClick={cycleSortType} 
            class="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 py-1 rounded hover:bg-gray-200"
            aria-label={`Sort by ${sortType}`}
          >
            {getSortIcon()}
          </button>

        </div>

        {/* Map through sortedCategories */}
        <ul class="space-y-1 mt-2 mb-24 lg:mb-12">
            {sortedCategories.map(({ name, notes }) => (
                <CollapsibleContainer 
                    client:load 
                    key={name}
                    category={name} 
                    notes={notes} 
                />
            ))}
        </ul>

      </aside>

      {/* Use an invisible overlay to capture clicks outside the sidebar */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} class="fixed inset-0 bg-[rgba(0,0,0,0.0)] z-10 lg:hidden"></div>
      )}
    </>
  );
}
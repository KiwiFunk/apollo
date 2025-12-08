import CollapsibleContainer from './CollapsibleContainer.tsx';
import { useCategorySorter } from '../hooks/useCategorySorter';
import { useSidebarState } from '../hooks/useSidebarState';

// Global noteStore related imports
import { useStore } from '@nanostores/preact';
import { $notesStore } from '../stores/notesStore';

// Helper component for the sort button UI
const SortButton = ({ sortType, onClick }: { sortType: string, onClick: () => void }) => {
  const getSortIcon = () => {
    if (sortType === 'alphaAsc') return 'A-Z';
    if (sortType === 'alphaDesc') return 'Z-A';
    return 'Recent';
  };

  return (
    <button 
      onClick={onClick} 
      class="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 py-1 rounded hover:bg-gray-200"
      aria-label={`Sort by ${sortType}`}
    >
      {getSortIcon()}
    </button>
  );
};

export default function Sidebar() {

  // Get required data from Global Store
  const noteState = useStore($notesStore); // useStore causes re-render when notesStore changes
  const notesByCategory = noteState.categorized;
  
  // Use custom hooks to manage all state and logic
  const { isOpen, sidebarRef, handleContentClick, close } = useSidebarState();
  const { sortedCategories, sortType, cycleSortType } = useCategorySorter(notesByCategory);

  return (
    <>
      <aside
        ref={sidebarRef}
        onClick={handleContentClick}
        className={[
          "select-none w-72 bg-gray-50 border-r border-gray-200 p-6",
          "h-lvh transition-transform transform",
          "fixed lg:static z-20",
          "flex flex-col",          // Use flex to manage inner scrolling
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ].join(' ')}
      >
        <div class="flex items-center justify-between shrink-0">
          <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Categories</h2>
          <SortButton sortType={sortType} onClick={cycleSortType} />
        </div>

        {/* Inner Div for scrolling */}
        <div class="overflow-y-auto mt-2">
          <ul class="space-y-1 pb-24 lg:pb-12">
            {sortedCategories.map(({ name, notes }) => (
              <CollapsibleContainer 
                key={name}
                category={name} 
                notes={notes} 
              />
            ))}
          </ul>
        </div>
      </aside>

      {/* Invisible overlay to capture clicks outside the sidebar */}
      {isOpen && (
        <div onClick={close} class="fixed inset-0 bg-[rgba(0,0,0,0.0)] z-10 lg:hidden"></div>
      )}
    </>
  );
}
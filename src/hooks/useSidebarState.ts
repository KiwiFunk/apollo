import { useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $isSidebarOpen, closeSidebar } from '../stores/uiStore';

export function useSidebarState() {
  // Subscribe to the global store
  const isOpen = useStore($isSidebarOpen);
  const sidebarRef = useRef<HTMLElement | null>(null);

  // Helper to close sidebar when clicking a link inside it
  const handleContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // If clicking a link (<a>), close the sidebar
    if (target.closest('a')) {
      // Only close if we are in mobile mode (fixed position)
      if (sidebarRef.current && window.getComputedStyle(sidebarRef.current).position === 'fixed') {
        closeSidebar();
      }
    }
  };

  return { 
    isOpen, 
    sidebarRef, 
    handleContentClick, 
    close: closeSidebar // Expose the store action directly
  };
}
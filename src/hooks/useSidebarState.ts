import { useState, useEffect, useRef } from 'preact/hooks';

export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);

  // Effect to listen for the global toggle event from the burger button
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    }
  }, [isOpen]);

  // Handler to close the sidebar when a link is clicked on mobile
  // By using getComputedStyle instead of classList we can check only active styles
  const handleContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      if (sidebarRef.current && window.getComputedStyle(sidebarRef.current).position === 'fixed') {
        setIsOpen(false);
      }
    }
  };

  return { isOpen, sidebarRef, handleContentClick, close: () => setIsOpen(false) };
}
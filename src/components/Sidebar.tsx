import { useState, useEffect, useRef } from 'preact/hooks';

export default function Sidebar({ children }: { children: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null); // Create a ref for the aside element

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

  return (
    <>
      <aside
        ref={sidebarRef}                // Attach the ref
        onClick={handleContentClick}    // Attach the click handler
        className={[
          "w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6",
          "h-full transition-transform transform",
          "fixed lg:static z-20",
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ].join(' ')}
      >
        {children}
      </aside>

      {/* Use an invisible overlay to capture clicks outside the sidebar */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} class="fixed inset-0 bg-[rgba(0,0,0,0.0)] z-10 lg:hidden"></div>
      )}
    </>
  );
}
import { useState, useEffect } from 'preact/hooks';

// Define shape
// Child prop will be a function, not a regular component.
interface SidebarControllerProps {
  children: (props: {
    isOpen: boolean;
    toggle: () => void;
  }) => any;
}

export default function SidebarController({ children }: SidebarControllerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // Handle side-effects like body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    };
  }, [isOpen]);

  // Call children with the current state and the toggle function.
  return children({ isOpen, toggle });
}
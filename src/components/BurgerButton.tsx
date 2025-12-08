import { useState } from 'preact/hooks';

export default function BurgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  // Wrapper: Centers the SVG in the button
  const wrapperBase = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all duration-300 ease-in-out";

  // SVG: Handles Rotation
  const svgBase = "w-6 h-6 text-gray-800 transition-all duration-300 ease-in-out transform";

  return (
    <button 
      onClick={toggle} 
      className="lg:hidden relative w-10 h-10 focus:outline-none z-50"
      aria-label="Toggle Menu"
      aria-expanded={isOpen}
    >
      
      {/* --- TOP LINE --- */}
      <div className={`
        ${wrapperBase}
        ${isOpen ? 'mt-0 delay-0' : '-mt-[7px] delay-300'} 
      `}>
        <svg viewBox="0 0 24 24" className={`${svgBase} ${isOpen ? 'rotate-45 delay-300' : 'rotate-0 delay-0'}`}>
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

      {/* --- MIDDLE LINE --- */}
      <div className={`
        ${wrapperBase}
        ${isOpen ? 'opacity-0 duration-0 delay-150' : 'opacity-100 delay-300'}
      `}>
        <svg viewBox="0 0 24 24" className={svgBase}>
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

      {/* --- BOTTOM LINE --- */}
      <div className={`
        ${wrapperBase}
        ${isOpen ? 'mt-0 delay-0' : 'mt-[7px] delay-300'}
      `}>
        <svg viewBox="0 0 24 24" className={`${svgBase} ${isOpen ? '-rotate-45 delay-300' : 'rotate-0 delay-0'}`}>
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

    </button>
  );
}
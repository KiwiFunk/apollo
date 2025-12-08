import { useState } from 'preact/hooks';
import clsx from 'clsx';              // A tiny utility for combining class names conditionally

// Define data structure for Labels
type HardwareToggleProps = {
  onChange?: (value: boolean) => void; // Optional callback to tell the parent "I changed!"
  Labels: { on: string; off: string }; // Configurable text (e.g., "View" vs "Edit")
}

// Accept callback to handle mode change
export default function HardwareToggle({ onChange, Labels }: HardwareToggleProps) {

  // 'isOn' is a bool value that signals if the toggle is on or not
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    const newState = !isOn; // new state = opposite of current state
    setIsOn(newState);      // Update internal visual state
    onChange?.(newState);   // Notify the parent component (if a handler exists)
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={clsx(
        // Toggle Dimensions (Fixed Size)
        "relative inline-flex h-8 w-20 shrink-0 cursor-pointer rounded border-2 border-transparent transition-colors duration-200 ease-in-out",
        // Focus rings for keyboard accessibility (Tab key)
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
        // Dynamic Background Color
        isOn ? "bg-indigo-600" : "bg-gray-200"
      )}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Use setting</span>
      
      {/* Slider Knob */}
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none inline-block h-7 w-4 transform rounded bg-white shadow ring-0 transition duration-200 ease-in-out z-1000",
          isOn ? "translate-x-15" : "translate-x-0"
        )}
      />

      {/* Label */}
      <span className={clsx(
        "absolute inset-0 flex items-center justify-center text-[12px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200",
        isOn ? "text-white" : "text-gray-500"
      )}>
        {isOn ? Labels.on : Labels.off}
      </span>
    </button>
  );
}
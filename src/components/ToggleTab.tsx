import { useState } from 'preact/hooks';
import clsx from 'clsx';

// Define data structure for Labels
type HardwareToggleProps = {
  onChange?: (value: boolean) => void;
  Labels: { on: string; off: string };
}

// Accept callback to handle mode change
export default function HardwareToggle({ onChange, Labels }: HardwareToggleProps) {

  // 'State' is a bool value that signals if the toggle is on or not
  const [state, setState] = useState(false);

  const handleToggle = () => {
    setState(prev => {
      onChange?.(!prev);
      return !prev;
    });
  };


  return (
    <div
      onClick={handleToggle}
      class="relative inset-shadow-2xs aspect-[2.5/1] h-[60%] bg-gray-100 rounded p-1 cursor-pointer select-none overflow-hidden z-10"
    >
      {/* Accent Fill */}
      <div
        class={clsx(
          "absolute inset-0 rounded transition-colors duration-300",
          state ? "bg-indigo-600" : "bg-transparent"
        )}
      />

      {/* Slider Wrapper */}
      <div
        class={clsx(
          "absolute inset-0 flex items-center transition-all duration-300 px-0.5",
          state ? "justify-end" : "justify-start"
        )}
      >
        {/* Slider */}
        <div class="bg-white rounded shadow-md w-[18%] h-[85%] z-1000" />
      </div>

      {/* Label */}
      <div class={clsx("absolute inset-0 flex items-center justify-center font-semibold tracking-wider pointer-events-none text-xs", state ? "text-white" : "text-gray-700")}>
        {state ? Labels.on : Labels.off}
      </div>
    </div>
  );
}

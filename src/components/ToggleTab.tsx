import { useState } from 'preact/hooks';
import clsx from 'clsx';

// Accept callback to handle mode change
export default function HardwareToggle({ onChange }: { onChange?: (mode: "ON" | "OFF") => void }) {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next ? "ON" : "OFF");
  };

  return (
    <div
      onClick={toggle}
      class="relative inset-shadow-2xs aspect-[2.5/1] h-[60%] bg-gray-100 rounded p-1 cursor-pointer select-none overflow-hidden"
    >
      {/* Accent Fill */}
      <div
        class={clsx(
          "absolute inset-0 rounded transition-colors duration-300",
          on ? "bg-indigo-600" : "bg-transparent"
        )}
      />

      {/* Slider Wrapper */}
      <div
        class={clsx(
          "absolute inset-0 flex items-center transition-all duration-300 px-0.5",
          on ? "justify-end" : "justify-start"
        )}
      >
        {/* Slider */}
        <div class="bg-white rounded shadow-md w-[18%] h-[90%] z-1000" />
      </div>

      {/* Label */}
      <div class={clsx("absolute inset-0 flex items-center justify-center font-semibold tracking-wider pointer-events-none text-xs", on ? "text-white" : "text-gray-900")}>
        {on ? "EDIT" : "VIEW"}
      </div>
    </div>
  );
}

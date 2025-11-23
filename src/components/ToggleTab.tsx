import { useState } from 'preact/hooks';
import clsx from 'clsx';

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
      class="relative aspect-3/1 h-[66%] bg-gray-200 rounded p-1 cursor-pointer select-none overflow-hidden"
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
          "absolute inset-0 flex items-center transition-all duration-300 px-1",
          on ? "justify-end" : "justify-start"
        )}
      >
        {/* Slider */}
        <div class="bg-gray-100 rounded shadow-md w-[18%] h-[90%] z-1000" />
      </div>

      {/* Label */}
      <div class={clsx("absolute inset-0 flex items-center justify-center font-semibold tracking-wider pointer-events-none text-xs", on ? "text-white" : "text-gray-900")}>
        {on ? "EDIT" : "VIEW"}
      </div>
    </div>
  );
}

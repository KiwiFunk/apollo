import clsx from 'clsx';

export default function Button({ label, accent, onClick }: { label: string, accent?: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick} 
            class={clsx("inset-shadow-2xs px-4 py-2 rounded transition-colors duration-300 cursor-pointer text-sm font-semibold tracking-wider", {
                "bg-indigo-600 text-white hover:bg-indigo-700": accent,
                "bg-gray-100 text-gray-700 hover:bg-gray-300": !accent
            })}
        >
            {label}
        </button>
    );
}
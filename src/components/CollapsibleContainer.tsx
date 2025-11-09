import { useState } from 'preact/hooks';
import type { Note } from '../types';

// Define the shape of the props we expect
interface Props {
  category: string;
  notes: Note[];
}

export default function CollapsibleContainer({ category, notes }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen(prev => !prev);
    };

    return (
    <li className="list-none">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-gray-200"
        onClick={toggleCollapse}
        role="button"
        tabIndex={0}
      >
        <h3 className="font-semibold text-gray-900">{category}</h3>
        
        {/* Toggle indicator */}
        <div className="flex items-center justify-center h-6 w-6 text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="2" 
            stroke="currentColor" 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
      
      {/* Content area that renders the notes */}
      <div 
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul class="pt-1 pb-2 ml-2 space-y-2 border-l border-gray-300">
            {notes.map(note => (
                <li key={note.url}>
                    <a href={note.url} class="block pl-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-r-lg py-1 transition-colors">
                        {note.frontmatter.title}
                    </a>
                </li>
            ))}
        </ul>
      </div>
    </li>
  );
}
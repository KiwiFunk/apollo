import { useState } from 'preact/hooks';
import type { SelectedNote } from "../types";
import ToggleTab from '../components/ToggleTab.tsx';

// Define prop types
type StatsBarProps = {
    metadata: SelectedNote['metadata'];
    htmlContent: string;
    toggleState?: (value: boolean) => void;
}

export default function StatsBar({ metadata, htmlContent, toggleState }: StatsBarProps) {

    // State to manage the visibility of the stats section
    const [isOpen, setIsOpen] = useState(true);

    // Deconstruct frontmatter to get title, category and publish_date
    const { title, publishDate, category } = metadata;

    // Properly format the date for human eyes
    const formattedDate = new Date(publishDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'UTC' 
    });

    const totalWords = htmlContent.split(/\s+/).length;

    const calcReadingTime = () => {
        // Simple reading time calculation: average adult reads about 200-250 words per minute
        const wordsPerMinute = 225;
        const result = totalWords / wordsPerMinute;
        
        if (result < 1) return "Under a minute";
        else return `${Math.ceil(result)} min read`;
    }

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 w-full">

            {/* Content here will be hidden when stats collapsed */}
            <div className={`
                transition-[max-height] duration-400 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-96' : 'max-h-0'}
            `}>
                {/* Upper Section */}
                <div class="flex items-center justify-between px-7 p-4">

                    <div>
                        <h4 class="text-gray-400 text-xs font-semibold uppercase tracking-widest">Note Title</h4>
                        <h1 class="tracking-wider text-lg font-semibold">{title}</h1>
                    </div>

                    {/* Note Statistics */}
                    <div class="text-[11px] uppercase tracking-widest font-semibold flex flex-col sm:flex-row gap-1.5 sm:gap-6">
                        <span>
                            <h4 class="text-gray-400">Published:</h4>
                            {formattedDate}
                        </span>

                        <span>
                            <h4 class="text-gray-400">Words:</h4>
                            {totalWords}    
                        </span>

                        <span>
                            <h4 class="text-gray-400">Reading Time:</h4>
                            {calcReadingTime()}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div class="border-t border-gray-200" />

            </div>


    
            {/* Lower Section */}
            <div class={`h-12 flex justify-between px-7 transition-all duration-200 ease-in-out`}>
                {/* Breadcrumbs */}
                <div class="flex flex-row gap-x-4 items-center">
                    <a 
                        href="/" 
                        class="text-indigo-600 text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer"
                    >
                        &larr; Home
                    </a>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0">{ category }</p>
                </div>

                <div class="flex flex-row gap-x-4 items-center">
                    {/* Edit Toggle - Pass toggleState callback to send edit mode state to parent */}
                    <ToggleTab onChange={(isEdit) => toggleState?.(isEdit)} Labels={{ on: "EDIT", off: "VIEW" }} />

                    {/* Show/Hide Toggle */}
                    <div onClick={handleToggle} role="button">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width="2" 
                            stroke="currentColor" 
                            className={`w-4 h-4 cursor-pointer transition-transform duration-400 ${!isOpen ? 'rotate-180' : ''}`}
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 15.75L12 8.25l-7.5 7.5" />
                        </svg>
                    </div>
                </div>
            </div>
            
            
        </div>

    )
}
import { useState } from 'preact/hooks';
import type { Frontmatter } from "../types";

export default function StatsBar({ frontmatter, htmlContent, handleBackClick }: { frontmatter: Frontmatter, htmlContent: string, handleBackClick: () => void }) {

    // State to manage the visibility of the stats section
    const [isOpen, setIsOpen] = useState(true);

    // Deconstruct frontmatter to get title, category and publish_date
    const { title, publishDate, category } = frontmatter;

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
            {/* Upper Section */}
            <div class="flex items-center justify-between px-7 pt-4">

                <div>
                    <h4 class="text-gray-400 text-xs font-semibold uppercase tracking-widest">Note Title</h4>
                    <h1 class="tracking-wider text-lg font-semibold">{title}</h1>
                </div>

                {/* Note Statistics */}
                <div class="text-[11px] uppercase tracking-widest font-semibold flex flex-row gap-6">
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

            <div class="border-t border-gray-200 my-4" />
    
            {/* Lower Section */}
            <div>

                {/* Breadcrumbs */}
                <div class="flex flex-row gap-5 items-baseline px-7">
                    <button onClick={handleBackClick} className="text-indigo-600 text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer">
                        &larr; Home
                    </button>

                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0 mb-4">{ category }</p>
                </div>

                {/* Show/Hide Toggle */}
                <div>

                </div>

            </div>
        </div>

    )
}
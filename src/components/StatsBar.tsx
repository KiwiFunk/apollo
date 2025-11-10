// Here we pull the metadata for the note and display it in a stats bar at the top of the note view.

// { title } will be doucment name

// { publish_date } we need to extract date only since we dont dother collecting timestamp

//
import type { Frontmatter } from "../types";

export default function StatsBar({ frontmatter, htmlContent, handleBackClick }: { frontmatter: Frontmatter, htmlContent: string, handleBackClick: () => void }) {

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
        
        if (result < 1) return "Less than a minute";
        else return `${Math.ceil(result)} min read`;
    }

    return (
        <div class="bg-white border-b border-gray-200 w-full shadow-sm">
            {/* Upper Section */}
            <div class="flex items-center justify-between px-7 pt-5">

                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Note Title</h4>
                    <h1>{title}</h1>
                </div>

                {/* Note Statistics */}
                <div>
                    <span class="flex-col">
                        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Published:</h4>
                        {formattedDate}
                    </span>

                    <span class="flex-col">
                        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Words:</h4>
                        {totalWords}    
                    </span>

                    <span class="flex-col">
                        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Reading Time:</h4>
                        {calcReadingTime()}
                    </span>
                </div>
            </div>

            <div class="border-t border-gray-200 my-5" />
    
            <div class="flex flex-row gap-5 items-baseline px-7">
                <button onClick={handleBackClick} className="text-indigo-600 text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer">
                    &larr; Home
                </button>

                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0 mb-5">{ category }</p>
            </div>
        </div>

    )
}
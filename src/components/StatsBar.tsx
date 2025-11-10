// Here we pull the metadata for the note and display it in a stats bar at the top of the note view.

// { title } will be doucment name

// { publish_date } we need to extract date only since we dont dother collecting timestamp

//
import type { Frontmatter } from "../types";

export default function StatsBar({ frontmatter, htmlContent, handleBackClick }: { frontmatter: Frontmatter, htmlContent: string, handleBackClick: () => void }) {

    // Deconstruct frontmatter to get title and publish_date
    const { title, publishDate, category } = frontmatter;

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
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Note Title</h2>
                    <h1>{title}</h1>
                </div>

                {/* Note Statistics */}
                <div>
                    <span class="flex-col">
                        <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Published:</h2>
                        {publishDate}
                    </span>

                    <span class="flex-col">
                        <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Words:</h2>
                        {totalWords}
                    </span>

                    <span class="flex-col">
                        <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Reading Time:</h2>
                        {calcReadingTime()}
                    </span>
                </div>
            </div>

            <hr className="my-4" />

            {/* Lower Section */}
            <div>
                <button onClick={handleBackClick} className="mb-8 text-indigo-600 hover:underline">
                    &larr; Back to Home
                </button>

                <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">{ category }</h2>
            </div>
        </div>

    )
}
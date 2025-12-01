import { useState, useEffect, useRef, useMemo } from 'preact/hooks';
import type { FullNote, NoteMeta } from '../types';

export default function Delphi({ note }: { note?: FullNote }) {

    const [meta, setMeta] = useState<NoteMeta>(note?.metadata || {
        title: '', category: '', description: '', slug: '', userId: '', publishDate: new Date(), tags: []
    });
    
    const [content, setContent] = useState(note?.content || '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 1. Calculate Stats
    const wordCount = useMemo(() => content.trim().split(/\s+/).filter(w => w.length > 0).length, [content]);
    const charCount = content.length;

    useEffect(() => {
        if (note) {
            setMeta(note.metadata);
            setContent(note.content);
        }
    }, [note]);

    const adjustHeight = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    };

    useEffect(() => { adjustHeight(); }, [content]);

    return (
        // 2. Integrated Container Styles (Border, Background, Shadow)
        <div className="relative max-w-5xl lg:m-12 p-6 bg-gray-100 rounded-lg border border-gray-300 font-mono text-sm text-gray-800 overflow-hidden">

          <p class="mb-2 font-bold text-gray-500 uppercase text-xs tracking-wider">Raw Markdown Content:</p>
            
            {/* Main Content Area */}
            <div className="p-6 lg:p-10 pb-12"> 
                
                {/* --- FRONTMATTER SECTION --- */}
                <div className="space-y-0 leading-relaxed"> 
                    <div className="text-gray-400 select-none font-bold">---</div>
                    
                    <div className="flex items-center h-6 group">
                        <span className="text-purple-700 font-bold select-none mr-2">Title:</span>
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-gray-900 font-mono text-sm h-full placeholder-gray-400 outline-none"
                            value={meta.title}
                            onInput={(e) => setMeta({...meta, title: e.currentTarget.value})}
                            placeholder="Untitled Note"
                        />
                    </div>

                    <div className="flex items-center h-6 group">
                        <span className="text-purple-700 font-bold select-none mr-2">Category:</span>
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-gray-900 font-mono text-sm h-full placeholder-gray-400 outline-none"
                            value={meta.category || ''}
                            onInput={(e) => setMeta({...meta, category: e.currentTarget.value})}
                            placeholder="Uncategorized"
                        />
                    </div>

                    <div className="flex items-center h-6 group">
                        <span className="text-purple-700 font-bold select-none mr-2">Description:</span>
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-gray-900 font-mono text-sm h-full placeholder-gray-400 outline-none"
                            value={meta.description || ''}
                            onInput={(e) => setMeta({...meta, description: e.currentTarget.value})}
                            placeholder="Short description..."
                        />
                    </div>

                    <div className="text-gray-400 select-none font-bold">---</div>
                </div>

                {/* --- CONTENT BODY --- */}
                <textarea 
                    ref={textareaRef}
                    className="w-full bg-transparent border-none p-0 mt-6 focus:ring-0 resize-none outline-none overflow-hidden leading-relaxed text-gray-800 font-mono text-sm placeholder-gray-400"
                    value={content}
                    onInput={(e) => setContent(e.currentTarget.value)}
                    spellcheck={false}
                    placeholder="Start writing your markdown here..."
                />
            </div>

            {/* 3. Integrated Status Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-gray-200 border-t border-gray-300 text-[10px] uppercase tracking-wider text-gray-500 px-4 py-1 flex justify-between items-center select-none">
                <span className="font-bold text-purple-600">-- INSERT MODE --</span>
                <div className="flex gap-4 tracking-wider">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect, useRef, useMemo, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import type { FullNote, NoteMeta } from '../types';

// Define the functions parent can call
export interface DelphiRef {
    getSaveData: () => FullNote | null;
}

interface DelphiProps {
    note?: FullNote;
}
  
const Delphi = forwardRef<DelphiRef, DelphiProps>(({ note }, ref) => {

    const [meta, setMeta] = useState<NoteMeta>(note?.metadata || {
        title: '', category: '', description: '', slug: '', userId: '', publishDate: new Date(), tags: []
    });
    
    const [content, setContent] = useState(note?.content || '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Calculate Stats
    const wordCount = useMemo(() => content.trim().split(/\s+/).filter(w => w.length > 0).length, [content]);
    const charCount = content.length;

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getSaveData: () => {
          // Check if there were any changes made
          const isMetaChanged = JSON.stringify(meta) !== JSON.stringify(note?.metadata);
          const isContentChanged = content !== (note?.content || '');
          // If there were no changes, return null (This should still work with note creation)
          if (!isMetaChanged && !isContentChanged) return null;

          return {
            metadata: meta,
            content: content
          };
        }
    }));

    useEffect(() => {
        if (note) {
            setMeta(note.metadata);
            setContent(note.content);
        }
    }, [note]);

    // These classes scale the text down without triggering browsers such as iOS doing an automatic zoom
    const scaleText = "scale-[0.85] w-[117.65%] lg:w-full lg:scale-100 origin-top-left"

    return (
        // Integrated Container Styles (Border, Background, Shadow)
        <div className="relative max-w-5xl lg:m-12 p-6 bg-gray-100 rounded-lg border border-gray-300 font-mono text-base text-gray-800 overflow-hidden">

          <p class="mb-2 font-bold text-gray-500 uppercase text-xs tracking-wider">Raw Markdown Content:</p>
            
            {/* Main Content Area */}
            <div className="p-1 lg:p-10 pb-12"> 
                
                {/* --- FRONTMATTER SECTION --- */}
                {/* Set Indent to match label length */}
                <div className="space-y-0 leading-relaxed"> 
                    <div className="text-gray-400 select-none font-bold">---</div>
                    
                    {/* TITLE */}
                    <div className={`relative h-6 group ${scaleText}`}>
                        <span className="absolute text-purple-700 font-bold tracking-wide select-none pointer-events-none">Title:</span>
                        <input 
                            type="text" 
                            className="w-full h-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 font-mono text-base placeholder-gray-400 outline-none indent-[7ch]"
                            value={meta.title}
                            onInput={(e) => setMeta({...meta, title: e.currentTarget.value})}
                            placeholder="Untitled Note"
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className={`relative h-6 group ${scaleText}`}>
                        <span className="absolute text-purple-700 font-bold tracking-wide select-none pointer-events-none">Category:</span>
                        <input 
                            type="text" 
                            className="w-full h-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 font-mono text-base placeholder-gray-400 outline-none indent-[10ch]"
                            value={meta.category || ''}
                            onInput={(e) => setMeta({...meta, category: e.currentTarget.value})}
                            placeholder="Uncategorized"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className={`relative min-h-[1.5rem] group ${scaleText}`}>
                        <span className="absolute text-purple-700 font-bold tracking-wide select-none pointer-events-none">Description:</span>
                        
                        <div className="grid grid-cols-1 w-full">
                            {/* Ghost Element */}
                            <div className="invisible col-start-1 row-start-1 whitespace-pre-wrap wrap-break-word p-0 border-none indent-[13ch]" aria-hidden="true">
                                {(meta.description || '') + ' '}
                            </div>

                            {/* Actual Textarea */}
                            <textarea 
                                rows={1}
                                className="col-start-1 row-start-1 w-full h-full bg-transparent border-none p-0 focus:ring-0 resize-none outline-none overflow-hidden text-gray-900 font-mono text-base placeholder-gray-400 break-words whitespace-pre-wrap indent-[13ch]"
                                value={meta.description || ''}
                                onInput={(e) => setMeta({...meta, description: e.currentTarget.value})}
                                placeholder="Short description..."
                            />
                        </div>
                    </div>

                    <div className="text-gray-400 select-none font-bold">---</div>
                </div>

                {/* --- CONTENT BODY --- */}
                <div className={`grid grid-cols-1 mt-6 text-base ${scaleText} font-mono leading-relaxed`}>
                    {/* Ghost Element to dictate height & prevent scroll jumps - Prevents DOM Manipulation */}
                    <div className="invisible col-start-1 row-start-1 wrap-break-word whitespace-pre-wrap p-0 border-none" aria-hidden="true">
                        {content + '\n'}
                    </div>

                    {/* Actual Textarea: Overlays the ghost */}
                    <textarea 
                        ref={textareaRef}
                        className="col-start-1 row-start-1 w-full h-full bg-transparent border-none p-0 focus:ring-0 resize-none outline-none overflow-hidden text-gray-800 placeholder-gray-400 wrap-break-word whitespace-pre-wrap"
                        value={content}
                        onInput={(e) => setContent(e.currentTarget.value)}
                        spellcheck={false}
                        placeholder="Start writing your markdown here..."
                    />
                </div>
            </div>

            {/* Integrated Status Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-gray-200 border-t border-gray-300 text-[10px] uppercase tracking-wider text-gray-500 px-4 py-1 flex justify-between items-center select-none">
                <div className="flex gap-4">
                  <span className="font-semibold text-indigo-600">
                    <span className="flex items-center justify-center">
                      {/* Mobile */}
                      <span className="lg:hidden">-- INSERT --</span>
                                                                    
                      {/* Desktop */}
                      <span className="hidden lg:inline">-- INSERT MODE --</span>
                    </span>
                  </span>
                  <span className="tracking-wider">
                    <span className="flex items-center justify-center">
                      {/* Mobile */}
                      <span className="lg:hidden">DELPHI V0.1</span>
                                                                    
                      {/* Desktop */}
                      <span className="hidden lg:inline">DELPHI EDITOR V0.1</span>
                    </span>
                  </span>
                </div>
                <div className="flex gap-4 tracking-wider">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
            </div>
        </div>
    );
});

export default Delphi;
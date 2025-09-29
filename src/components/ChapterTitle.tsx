import { motion } from 'framer-motion';
import { marked } from 'marked';
import { Chapter } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface ChapterTitleProps {
  chapter: Chapter;
  onNext: () => void;
  onPrev: () => void;
}

export function ChapterTitle({ chapter, onNext, onPrev }: ChapterTitleProps) {
  // Use chapter.image if it exists and is not empty, otherwise use default from storage
  const imageSrc = (chapter.image && chapter.image.trim() !== '') 
    ? chapter.image 
    : supabase.storage.from('chapter-images').getPublicUrl(`Chapter-${chapter.chapter_number}.jpg`).data.publicUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex flex-col lg:flex-row"
    >
      {/* Left Panel - Image with Book Flip Animation */}
      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -90 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-4"
        style={{ perspective: '1000px' }}
      >
        <div className="relative w-full max-w-xl h-[450px] lg:h-[650px]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={chapter.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            />
          )}
        </div>
      </motion.div>

      {/* Right Panel - Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-4 lg:p-8"
      >
        <div className="max-w-lg">
          <p
            className="text-sm font-avenir tracking-wider text-slate-500 uppercase mb-4"
          >
            Chapter {chapter.chapter_number}
          </p>
          
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-avenir text-slate-800 mb-6 heading-tracking"
          >
            {chapter.title}
          </h1>
          
          {chapter.intro && (
            <div
              className="text-xl font-avenir text-slate-600 mb-4 heading-tracking"
              dangerouslySetInnerHTML={{
                __html: marked.parse(chapter.heading || '')
              }}
            >
            </div>
          )}
          
          {chapter.lede && (
            <p className="text-body-large font-lora mb-12 leading-body-relaxed px-4">
              {chapter.lede}
            </p>
          )}
          
          <div className="flex justify-between items-center w-full max-w-xs mt-8">
            <div className="flex-1"></div>
            
            <button
              onClick={onNext}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              Read Chapter →
            </button>
            
            <div className="flex-1"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import { Chapter, supabaseUrl } from '../lib/supabase';

interface ChapterTitleProps {
  chapter: Chapter;
  onNext: () => void;
  onPrev: () => void;
}

export function ChapterTitle({ chapter, onNext, onPrev }: ChapterTitleProps) {
  // Use Supabase storage bucket for fallback images
  const storageBucketBaseUrl = `${supabaseUrl}/storage/v1/object/public/chapter-images`;
  const fallbackImageSrc = `${storageBucketBaseUrl}/Chapter-${chapter.chapter_number}.jpg`;
  const imageSrc = chapter.chapter_image || fallbackImageSrc;

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
          <img
            src={imageSrc}
            alt={chapter.title}
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          />
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
            className="text-sm tracking-wider text-slate-500 uppercase mb-4"
            style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
          >
            Chapter {chapter.chapter_number}
          </p>
          
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mb-6"
            style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
          >
            {chapter.title}
          </h1>
          
          {chapter.intro && (
            <h2
              className="text-xl text-slate-600 mb-4"
              style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
            >
              {chapter.intro}
            </h2>
          )}
          
          {chapter.lede && (
            <p className="text-lg leading-relaxed text-slate-700 mb-12">
              {chapter.lede}
            </p>
          )}
          
          <div className="flex justify-between items-center w-full max-w-xs mt-8">
            <button
              onClick={onPrev}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
            >
              ← Back
            </button>
            
            <button
              onClick={onNext}
              className="px-8 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 transition-colors"
              style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
            >
              Read Chapter →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
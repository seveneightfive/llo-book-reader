import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '../lib/supabase';

interface ChapterTitleProps {
  chapter: Chapter;
  onNext: () => void;
  onPrev: () => void;
}

export function ChapterTitle({ chapter, onNext, onPrev }: ChapterTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {chapter.image_url && (
            <div className="mb-8">
              <img
                src={chapter.image_url}
                alt={chapter.title}
                className="w-full max-w-2xl h-64 object-cover rounded-lg shadow-lg mx-auto"
              />
            </div>
          )}
          
          <h1 className="text-4xl font-avenir text-slate-800 mb-4 heading-tracking">
            Chapter {chapter.chapter_number}
          </h1>
          
          <h2 className="text-3xl font-avenir text-slate-700 mb-6">
            {chapter.title}
          </h2>
          
          {chapter.lede && (
            <p className="text-xl font-lora text-slate-600 mb-8 max-w-3xl mx-auto leading-body-relaxed">
              {chapter.lede}
            </p>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={onPrev}
              className="px-6 py-2 font-avenir text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← Back
            </button>
            
            <button
              onClick={onNext}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              Start Reading →
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
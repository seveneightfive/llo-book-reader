import React from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { Book } from '../lib/supabase';

interface BookDedicationProps {
  book: Book;
  dedication: string;
  onNext: () => void;
  onPrevious: () => void;
}

export default function BookDedication({ book, dedication, onNext, onPrevious }: BookDedicationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative flex items-center justify-center p-8"
      style={{
        backgroundImage: book.image_url ? `url(${book.image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {book.image_url && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      )}
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-avenir text-white mb-8 dedication-tracking uppercase drop-shadow-lg">
            Dedication
          </h2>

          <blockquote className="text-xl font-lora italic text-slate-900 mb-12 leading-body-relaxed quote-tracking py-6 bg-white/80 backdrop-blur-md rounded-lg mx-4 px-8 shadow-xl">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: marked.parse(dedication)
              }}
            />
          </blockquote>

          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              className="px-6 py-2 font-avenir text-white hover:text-slate-200 transition-colors drop-shadow-lg"
            >
              ← Back
            </button>

            <button
              onClick={onNext}
              className="px-6 py-2 bg-white text-slate-900 rounded-full font-avenir hover:bg-slate-100 transition-colors shadow-lg"
            >
              Continue →
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
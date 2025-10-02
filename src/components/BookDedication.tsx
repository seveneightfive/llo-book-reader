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
    <>
      {/* Mobile Layout: Image on top, text below */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen md:hidden bg-white"
      >
        {book.image_url && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 py-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <blockquote className="text-lg font-lora italic text-slate-900 mb-8 leading-body-relaxed quote-tracking py-6 px-4 bg-slate-50 rounded-lg shadow-md">
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
                className="px-6 py-2 font-avenir text-slate-700 hover:text-slate-900 transition-colors"
              >
                ← Back
              </button>

              <button
                onClick={onNext}
                className="px-6 py-2 bg-slate-900 text-white rounded-full font-avenir hover:bg-slate-800 transition-colors shadow-lg"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Layout: Background image with overlay and centered text */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen relative hidden md:flex items-center justify-center p-8"
        style={{
          backgroundImage: book.image_url ? `url(${book.image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {book.image_url && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        )}

        <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col"
          >
            <blockquote className="text-xl font-lora italic text-slate-900 mb-8 leading-body-relaxed quote-tracking py-6 md:py-8 bg-white/80 backdrop-blur-md rounded-lg px-8 md:px-10 shadow-xl text-center">
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
    </>
  );
}
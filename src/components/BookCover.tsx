import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../lib/supabase';

interface BookCoverProps {
  book: Book;
  onNext: () => void;
}

export default function BookCover({ book, onNext }: BookCoverProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {book.cover_image && (
            <div className="mb-8">
              <img
                src={book.cover_image}
                alt={`Cover of ${book.title}`}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto"
              />
            </div>
          )}
          
          <h1 className="text-5xl font-avenir font-bold text-white mb-4 heading-tracking">
            {book.title}
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 font-avenir">
            by {book.author}
          </p>
          
          {book.dedication && (
            <blockquote className="text-lg font-lora italic text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              "{book.dedication}"
            </blockquote>
          )}
          
          <button
            onClick={onNext}
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-avenir font-medium text-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            Begin Reading
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export type GalleryImage = {
  gallery_image_title: string | null;
  gallery_image_url: string;
  gallery_image_caption: string | null;
  galllery_image_order: number;
  section_id: number;
  chapter_id: number;
  page_id: number;
};

export type Answer = {
  id: string;
  chapter_id: string;
  question: string | null;
  content: string | null;
  sort_order: number;
};
import React from 'react';
import { Book } from '../lib/supabase';

interface BookCoverProps {
  book: Book;
  onNext: () => void;
}

export default function BookCover({ book, onNext }: BookCoverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Book Cover Image */}
        {book.image_url && (
          <div className="mb-8">
            <img 
              src={book.image_url} 
              alt={`Cover of ${book.title}`}
              className="mx-auto max-w-sm w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {book.title}
        </h1>
        
        {/* Author */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          by {book.author}
        </p>
        
        {/* Begin Reading Button */}
        <button
          onClick={onNext}
          className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
        >
          Begin Reading
        </button>
      </div>
    </div>
  );
}
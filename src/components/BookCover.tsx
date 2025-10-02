import React from 'react';
import { Book } from '../lib/supabase';

interface BookCoverProps {
  book: Book;
  onNext: () => void;
}

export default function BookCover({ book, onNext }: BookCoverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {book.cover_image && (
          <div className="mb-8">
            <img
              src={book.cover_image}
              alt={`Cover of ${book.title}`}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto"
            />
          </div>
        )}
        
        <h1 className="text-5xl font-bold text-white mb-4">
          {book.title}
        </h1>
        
        <p className="text-xl text-slate-300 mb-8">
          by {book.author}
        </p>
        
        {book.dedication && (
          <div className="mb-8 p-6 bg-slate-800/50 rounded-lg">
            <p className="text-slate-200 italic">
              {book.dedication}
            </p>
          </div>
        )}
        
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Begin Reading
        </button>
      </div>
    </div>
  );
}
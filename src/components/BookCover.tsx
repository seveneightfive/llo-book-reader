import React from 'react';
import { Book } from '../lib/supabase';

interface BookCoverProps {
  book: Book;
}

export function BookCover({ book }: BookCoverProps) {
  return (
    <div className="text-center">
      {book.cover_image && (
        <img
          src={book.cover_image}
          alt={`${book.title} cover`}
          className="mx-auto mb-8 max-w-md rounded-lg shadow-lg"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
      <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
      <p className="text-sm text-gray-500">{book.view_count} views</p>
    </div>
  );
}
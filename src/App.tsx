import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { supabase, Book, Chapter } from './lib/supabase';
import BookReader from './components/BookReader';

function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBookAndChapters(slug);
    }
  }, [slug]);

  const fetchBookAndChapters = async (bookSlug: string) => {
    try {
      // Fetch book
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('slug', bookSlug)
        .single();

      if (bookError) throw bookError;
      if (!bookData) throw new Error('Book not found');

      setBook(bookData);

      // Increment view count
      await supabase
        .from('books')
        .update({ view_count: (bookData.view_count || 0) + 1 })
        .eq('id', bookData.id);

      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookData.id)
        .order('chapter_number', { ascending: true });

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);

    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-avenir text-lg">Loading book...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-avenir text-slate-800 mb-4">Book Not Found</h1>
          <p className="text-slate-600">{error || 'The requested book could not be found.'}</p>
        </div>
      </div>
    );
  }

  return <BookReader book={book} chapters={chapters} />;
}

function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-avenir text-lg">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-4xl font-avenir text-slate-800 mb-8 text-center heading-tracking">
          Book Library
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-avenir font-medium text-slate-800 mb-2">
                  {book.title}
                </h2>
                <p className="text-slate-600 font-avenir mb-4">by {book.author}</p>
                <a
                  href={`/book/${book.slug}`}
                  className="inline-block px-6 py-2 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
                >
                  Read Book
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:slug" element={<BookPage />} />
      </Routes>
    </Router>
  );
}
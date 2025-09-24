import { useState, useEffect } from 'react';
import { supabase, Book, Chapter, Page } from '../lib/supabase';

export function useBook(slug: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        
        // Fetch book
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (bookError) throw bookError;
        setBook(bookData);

        // Only fetch chapters if book exists
        if (bookData) {
          const { data: chaptersData, error: chaptersError } = await supabase
            .from('chapters')
            .select('*')
            .eq('book_id', bookData.id)
            .order('chapter_number');

          if (chaptersError) throw chaptersError;
          setChapters(chaptersData || []);
        } else {
          setChapters([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBook();
    }
  }, [slug]);

  return { book, chapters, loading, error };
}

export function useChapterPages(chapterId: string) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('sortOrder');

        if (error) throw error;
        setPages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pages');
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) {
      fetchPages();
    }
  }, [chapterId]);

  return { pages, loading, error };
}
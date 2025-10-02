import { useState, useEffect } from 'react';
import { supabase, Book, Chapter, Page, GalleryItem } from '../lib/supabase';

export function useBook(slug: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        setError(null);

        // Fetch book by slug
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('slug', slug)
          .single();

        if (bookError) {
          throw bookError;
        }

        if (!bookData) {
          throw new Error('Book not found');
        }

        setBook(bookData);

        // Fetch chapters for this book
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('book_id', bookData.id)
          .order('chapter_number', { ascending: true });

        if (chaptersError) {
          throw chaptersError;
        }

        setChapters(chaptersData || []);

        // Increment view count
        await supabase
          .from('books')
          .update({ view_count: bookData.view_count + 1 })
          .eq('id', bookData.id);

      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
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

export function useChapterPages(chapterId: number) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('order_index', { ascending: true });

        if (pagesError) {
          throw pagesError;
        }

        setPages(data || []);
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
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

export function useChapterGallery(chapterId: number) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: galleryError } = await supabase
          .from('gallery')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('sort_order', { ascending: true });

        if (galleryError) {
          throw galleryError;
        }

        setGalleryItems(data || []);
      } catch (err) {
        console.error('useChapterGallery - Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) {
      fetchGalleryItems();
    }
  }, [chapterId]);

  return { galleryItems, loading, error };
}
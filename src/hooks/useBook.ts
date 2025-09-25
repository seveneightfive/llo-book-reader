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
          // Increment view count (non-blocking)
          supabase
            .from('books')
            .update({ view_count: (bookData.view_count || 0) + 1 })
            .eq('id', bookData.id)
            .then(({ error }) => {
              if (error) {
                console.warn('Failed to increment view count:', error);
              }
            });

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

export function useChapterGallery(chapterId: string) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('sort_order');

        if (error) throw error;
        setGalleryItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery items');
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

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
          .single();

        if (bookError) throw bookError;
        if (!bookData) throw new Error('Book not found');

        setBook(bookData);

        // Fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('book_id', bookData.id)
          .order('chapter_number', { ascending: true });

        if (chaptersError) throw chaptersError;

        setChapters(chaptersData || []);

        // Increment view count
        await supabase
          .from('books')
          .update({ view_count: (bookData.view_count || 0) + 1 })
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

  useEffect(() => {
    async function fetchPages() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('page_order', { ascending: true });

        if (error) throw error;
        setPages(data || []);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, [chapterId]);

  return { pages, loading };
}

export function useChapterGallery(chapterId: number) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setGalleryItems(data || []);
      } catch (error) {
        console.error('useChapterGallery - Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryItems();
  }, [chapterId]);

  return { galleryItems, loading };
}
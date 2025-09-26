import { useState, useEffect } from 'react';
import { supabase, Book, Chapter, Page, GalleryItem } from '../lib/supabase';

export function useBook(slug: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCountIncremented, setViewCountIncremented] = useState(false);

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
          // Increment view count only once per session
          if (!viewCountIncremented) {
            try {
              const { error: updateError } = await supabase
                .from('books')
                .update({ view_count: (bookData.view_count || 0) + 1 })
                .eq('id', bookData.id);
              
              if (updateError) {
                console.warn('Failed to increment view count:', updateError);
              } else {
                console.log('View count incremented successfully');
                setViewCountIncremented(true);
                // Update local book data to reflect the new view count
                setBook(prev => prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : null);
              }
            } catch (err) {
              console.warn('Error incrementing view count:', err);
            }
          }

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
      setViewCountIncremented(false); // Reset when slug changes
      fetchBook();
    }
  }, [slug, viewCountIncremented]);

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
          .order('order_index');

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
        console.log('useChapterGallery - Fetching for chapter ID:', chapterId);
        setLoading(true);
        
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('sort_order');

        console.log('useChapterGallery - Query result:', { data, error });
        
        if (error) throw error;
        setGalleryItems(data || []);
        console.log('useChapterGallery - Set gallery items:', data?.length || 0);
      } catch (err) {
        console.error('useChapterGallery - Error:', err);
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

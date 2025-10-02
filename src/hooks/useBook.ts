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
        console.log('Fetching book with slug:', slug);
        setLoading(true);
        setError(null);
        
        // Fetch book
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        console.log('Supabase query result - data:', bookData);
        console.log('Supabase query result - error:', bookError);

        if (bookError) throw bookError;
        
        if (!bookData) {
          console.log(`No book found with slug "${slug}"`);
          setError(`Book with slug "${slug}" not found`);
          setBook(null);
          setChapters([]);
          setLoading(false);
          return;
        }
        
        console.log('Book found successfully:', bookData.title);
        setBook(bookData);

        // Increment view count (fire and forget, don't wait for response)
        supabase
          .from('books')
          .update({ 'view-count': (bookData['view-count'] || 0) + 1 })
          .eq('id', bookData.id)
          .then(({ error: updateError }) => {
            if (updateError) {
              console.warn('Failed to increment view count:', updateError);
            }
          })
          .catch(err => {
            console.warn('Error incrementing view count:', err);
          });

        // Fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('section_id', bookData.id)
          .order('chapter_order');

        console.log('Chapters query result - data:', chaptersData);
        console.log('Chapters query result - error:', chaptersError);

        if (chaptersError) throw chaptersError;
        setChapters(chaptersData || []);
      } catch (err) {
        console.error('Error in fetchBook:', err);
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

export function useChapterPages(chapterId: number) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        console.log('useChapterPages - Fetching for chapter ID:', chapterId);
        setLoading(true);
        
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('page_order');

        console.log('useChapterPages - Query result:', { data, error });
        console.log('useChapterPages - Data length:', data?.length || 0);
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

export function useChapterGallery(chapterId: number) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        console.log('useChapterGallery - Fetching for chapter ID:', chapterId);
        setLoading(true);
        
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('chapter_id', chapterId)
          .order('galllery_image_order');

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
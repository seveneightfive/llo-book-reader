import React, { useState, useEffect } from 'react';
import { supabase, Book, Chapter, Page, GalleryItem } from '../lib/supabase';
import { ChapterWithPages } from '../lib/pdfUtils';
import BookCover from './BookCover';
import BookDedication from './BookDedication';
import BookIntro from './BookIntro';
import ChapterTitle from './ChapterTitle';
import ChapterReader from './ChapterReader';
import ChapterGallery from './ChapterGallery';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

type ReadingState = 'cover' | 'dedication' | 'intro' | 'chapter-title' | 'chapter-content' | 'gallery';

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [currentState, setCurrentState] = useState<ReadingState>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    if (currentState === 'chapter-content' && currentChapter) {
      fetchPages(currentChapter.id);
    }
  }, [currentState, currentChapter]);

  useEffect(() => {
    if (currentState === 'gallery' && chapters.length > 0) {
      fetchGalleryItems();
    }
  }, [currentState, chapters]);

  const fetchPages = async (chapterId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
      setCurrentPageIndex(0);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      // Fetch gallery items for all chapters in this book
      const chapterIds = chapters.map(ch => ch.id);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .in('chapter_id', chapterIds)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    switch (currentState) {
      case 'cover':
        if (book.dedication) {
          setCurrentState('dedication');
        } else if (book.intro) {
          setCurrentState('intro');
        } else if (chapters.length > 0) {
          setCurrentState('chapter-title');
        }
        break;
      
      case 'dedication':
        if (book.intro) {
          setCurrentState('intro');
        } else if (chapters.length > 0) {
          setCurrentState('chapter-title');
        }
        break;
      
      case 'intro':
        if (chapters.length > 0) {
          setCurrentState('chapter-title');
        }
        break;
      
      case 'chapter-title':
        setCurrentState('chapter-content');
        break;
      
      case 'chapter-content':
        if (currentPageIndex < pages.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1);
        } else if (currentChapterIndex < chapters.length - 1) {
          setCurrentChapterIndex(currentChapterIndex + 1);
          setCurrentState('chapter-title');
        } else {
          setCurrentState('gallery');
        }
        break;
      
      case 'gallery':
        // End of book
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentState) {
      case 'dedication':
        setCurrentState('cover');
        break;
      
      case 'intro':
        if (book.dedication) {
          setCurrentState('dedication');
        } else {
          setCurrentState('cover');
        }
        break;
      
      case 'chapter-title':
        if (currentChapterIndex > 0) {
          setCurrentChapterIndex(currentChapterIndex - 1);
          setCurrentState('chapter-content');
          // Will need to fetch pages for previous chapter
        } else if (book.intro) {
          setCurrentState('intro');
        } else if (book.dedication) {
          setCurrentState('dedication');
        } else {
          setCurrentState('cover');
        }
        break;
      
      case 'chapter-content':
        if (currentPageIndex > 0) {
          setCurrentPageIndex(currentPageIndex - 1);
        } else {
          setCurrentState('chapter-title');
        }
        break;
      
      case 'gallery':
        if (chapters.length > 0) {
          setCurrentChapterIndex(chapters.length - 1);
          setCurrentState('chapter-content');
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-avenir text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentState === 'cover' && (
        <BookCover book={book} onNext={handleNext} />
      )}
      
      {currentState === 'dedication' && book.dedication && (
        <BookDedication
          book={book}
          dedication={book.dedication}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
      
      {currentState === 'intro' && book.intro && (
        <BookIntro 
          intro={book.intro} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {currentState === 'chapter-title' && currentChapter && (
        <ChapterTitle 
          chapter={currentChapter} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {currentState === 'chapter-content' && currentChapter && pages.length > 0 && (
        <ChapterReader 
          chapter={currentChapter}
          page={pages[currentPageIndex]}
          pageNumber={currentPageIndex + 1}
          totalPages={pages.length}
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {currentState === 'gallery' && (
        <ChapterGallery 
          galleryItems={galleryItems}
          onPrevious={handlePrevious} 
        />
      )}
    </div>
  );
}
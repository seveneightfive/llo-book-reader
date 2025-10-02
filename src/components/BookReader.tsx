import React, { useState, useEffect } from 'react';
import { Book, Chapter, Page, GalleryItem, supabase } from '../lib/supabase';
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

type ReadingState = 
  | 'cover'
  | 'dedication'
  | 'intro'
  | 'chapter-title'
  | 'chapter-content'
  | 'chapter-gallery';

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [currentState, setCurrentState] = useState<ReadingState>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentChapter = chapters[currentChapterIndex];

  const fetchPagesForChapter = async (chapterId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('final_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryForChapter = async (chapterId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGalleryItems([]);
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
        } else {
          setCurrentState('chapter-title');
        }
        break;
      case 'dedication':
        if (book.intro) {
          setCurrentState('intro');
        } else {
          setCurrentState('chapter-title');
        }
        break;
      case 'intro':
        setCurrentState('chapter-title');
        break;
      case 'chapter-title':
        setCurrentState('chapter-content');
        fetchPagesForChapter(currentChapter.id);
        break;
      case 'chapter-content':
        setCurrentState('chapter-gallery');
        fetchGalleryForChapter(currentChapter.id);
        break;
      case 'chapter-gallery':
        if (currentChapterIndex < chapters.length - 1) {
          setCurrentChapterIndex(currentChapterIndex + 1);
          setCurrentState('chapter-title');
        }
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
          setCurrentState('chapter-gallery');
          fetchGalleryForChapter(chapters[currentChapterIndex - 1].id);
        } else if (book.intro) {
          setCurrentState('intro');
        } else if (book.dedication) {
          setCurrentState('dedication');
        } else {
          setCurrentState('cover');
        }
        break;
      case 'chapter-content':
        setCurrentState('chapter-title');
        break;
      case 'chapter-gallery':
        setCurrentState('chapter-content');
        fetchPagesForChapter(currentChapter.id);
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
      
      {currentState === 'chapter-content' && currentChapter && (
        <ChapterReader 
          chapter={currentChapter} 
          pages={pages}
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {currentState === 'chapter-gallery' && currentChapter && (
        <ChapterGallery 
          chapter={currentChapter} 
          galleryItems={galleryItems}
          onNext={currentChapterIndex < chapters.length - 1 ? handleNext : undefined}
          onPrevious={handlePrevious} 
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Book, Chapter, GalleryItem } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { BookCover } from './BookCover';
import { BookDedication } from './BookDedication';
import { BookIntro } from './BookIntro';
import { ChapterTitle } from './ChapterTitle';
import { ChapterReader } from './ChapterReader';
import { ChapterGallery } from './ChapterGallery';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

type ReadingState = 
  | { type: 'cover' }
  | { type: 'dedication' }
  | { type: 'intro' }
  | { type: 'chapter-title'; chapterIndex: number }
  | { type: 'chapter-content'; chapterIndex: number }
  | { type: 'chapter-gallery'; chapterIndex: number };

const BookReader: React.FC<BookReaderProps> = ({ book, chapters }) => {
  const [readingState, setReadingState] = useState<ReadingState>({ type: 'cover' });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const fetchGalleryItems = async (chapterId: string) => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('sort_order');

    if (error) {
      console.error('Error fetching gallery items:', error);
      return;
    }

    setGalleryItems(data || []);
  };

  const handleNext = () => {
    switch (readingState.type) {
      case 'cover':
        if (book.dedication) {
          setReadingState({ type: 'dedication' });
        } else if (book.intro) {
          setReadingState({ type: 'intro' });
        } else if (chapters.length > 0) {
          setReadingState({ type: 'chapter-title', chapterIndex: 0 });
        }
        break;

      case 'dedication':
        if (book.intro) {
          setReadingState({ type: 'intro' });
        } else if (chapters.length > 0) {
          setReadingState({ type: 'chapter-title', chapterIndex: 0 });
        }
        break;

      case 'intro':
        if (chapters.length > 0) {
          setReadingState({ type: 'chapter-title', chapterIndex: 0 });
        }
        break;

      case 'chapter-title':
        setReadingState({ type: 'chapter-content', chapterIndex: readingState.chapterIndex });
        break;

      case 'chapter-content':
        const currentChapter = chapters[readingState.chapterIndex];
        fetchGalleryItems(currentChapter.id);
        setReadingState({ type: 'chapter-gallery', chapterIndex: readingState.chapterIndex });
        break;

      case 'chapter-gallery':
        const nextChapterIndex = readingState.chapterIndex + 1;
        if (nextChapterIndex < chapters.length) {
          setReadingState({ type: 'chapter-title', chapterIndex: nextChapterIndex });
        }
        break;
    }
  };

  const handlePrevious = () => {
    switch (readingState.type) {
      case 'dedication':
        setReadingState({ type: 'cover' });
        break;

      case 'intro':
        if (book.dedication) {
          setReadingState({ type: 'dedication' });
        } else {
          setReadingState({ type: 'cover' });
        }
        break;

      case 'chapter-title':
        if (readingState.chapterIndex === 0) {
          if (book.intro) {
            setReadingState({ type: 'intro' });
          } else if (book.dedication) {
            setReadingState({ type: 'dedication' });
          } else {
            setReadingState({ type: 'cover' });
          }
        } else {
          setReadingState({ type: 'chapter-gallery', chapterIndex: readingState.chapterIndex - 1 });
        }
        break;

      case 'chapter-content':
        setReadingState({ type: 'chapter-title', chapterIndex: readingState.chapterIndex });
        break;

      case 'chapter-gallery':
        setReadingState({ type: 'chapter-content', chapterIndex: readingState.chapterIndex });
        break;
    }
  };

  const renderCurrentView = () => {
    switch (readingState.type) {
      case 'cover':
        return <BookCover book={book} onNext={handleNext} />;

      case 'dedication':
        return (
          <BookDedication 
            book={book} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        );

      case 'intro':
        return (
          <BookIntro 
            book={book} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        );

      case 'chapter-title':
        return (
          <ChapterTitle 
            chapter={chapters[readingState.chapterIndex]} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        );

      case 'chapter-content':
        return (
          <ChapterReader 
            chapter={chapters[readingState.chapterIndex]} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        );

      case 'chapter-gallery':
        return (
          <ChapterGallery 
            chapter={chapters[readingState.chapterIndex]} 
            galleryItems={galleryItems}
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        );

      default:
        return <BookCover book={book} onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default BookReader;
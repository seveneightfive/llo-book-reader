import React, { useState, useEffect } from 'react';
import { supabase, Book, Chapter, GalleryItem } from '../lib/supabase';
import BookCover from './BookCover';
import BookDedication from './BookDedication';
import BookIntro from './BookIntro';
import ChapterTitle from './ChapterTitle';
import { ChapterReader } from './ChapterReader';
import ChapterGallery from './ChapterGallery';

type ReadingState = 'cover' | 'dedication' | 'intro' | 'chapter-title' | 'chapter-content' | 'chapter-gallery';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [readingState, setReadingState] = useState<ReadingState>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    if (readingState === 'chapter-gallery' && currentChapter) {
      fetchGalleryItems(currentChapter.id);
    }
  }, [readingState, currentChapter]);

  const fetchGalleryItems = async (chapterId: string) => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGalleryItems([]);
    }
  };

  const handleNext = () => {
    switch (readingState) {
      case 'cover':
        if (book.dedication) {
          setReadingState('dedication');
        } else if (book.intro) {
          setReadingState('intro');
        } else {
          setReadingState('chapter-title');
        }
        break;
      case 'dedication':
        if (book.intro) {
          setReadingState('intro');
        } else {
          setReadingState('chapter-title');
        }
        break;
      case 'intro':
        setReadingState('chapter-title');
        break;
      case 'chapter-title':
        setReadingState('chapter-content');
        break;
      case 'chapter-content':
        setReadingState('chapter-gallery');
        break;
      case 'chapter-gallery':
        if (currentChapterIndex < chapters.length - 1) {
          setCurrentChapterIndex(currentChapterIndex + 1);
          setReadingState('chapter-title');
        }
        break;
    }
  };

  const handlePrevious = () => {
    switch (readingState) {
      case 'dedication':
        setReadingState('cover');
        break;
      case 'intro':
        if (book.dedication) {
          setReadingState('dedication');
        } else {
          setReadingState('cover');
        }
        break;
      case 'chapter-title':
        if (currentChapterIndex > 0) {
          setCurrentChapterIndex(currentChapterIndex - 1);
          setReadingState('chapter-gallery');
        } else if (book.intro) {
          setReadingState('intro');
        } else if (book.dedication) {
          setReadingState('dedication');
        } else {
          setReadingState('cover');
        }
        break;
      case 'chapter-content':
        setReadingState('chapter-title');
        break;
      case 'chapter-gallery':
        setReadingState('chapter-content');
        break;
    }
  };

  const renderCurrentView = () => {
    switch (readingState) {
      case 'cover':
        return <BookCover book={book} onNext={handleNext} />;
      case 'dedication':
        return <BookDedication book={book} onNext={handleNext} onPrevious={handlePrevious} />;
      case 'intro':
        return <BookIntro book={book} onNext={handleNext} onPrevious={handlePrevious} />;
      case 'chapter-title':
        return (
          <ChapterTitle
            chapter={currentChapter}
            chapterNumber={currentChapterIndex + 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'chapter-content':
        return (
          <ChapterReader
            chapter={currentChapter}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'chapter-gallery':
        return (
          <ChapterGallery
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
    <div className="min-h-screen bg-slate-50">
      {renderCurrentView()}
    </div>
  );
}
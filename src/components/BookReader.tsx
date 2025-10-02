import React, { useState, useEffect } from 'react';
import { Book, Chapter, GalleryItem, supabase } from '../lib/supabase';
import BookCover from './BookCover';
import { BookDedication } from './BookDedication';
import BookIntro from './BookIntro';
import ChapterTitle from './ChapterTitle';
import ChapterReader from './ChapterReader';
import ChapterGallery from './ChapterGallery';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

type ReadingState = 'cover' | 'dedication' | 'intro' | 'chapter-title' | 'chapter-content' | 'chapter-gallery';

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [readingState, setReadingState] = useState<ReadingState>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    const fetchGalleryItems = async () => {
      if (readingState === 'chapter-gallery' && currentChapter) {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('chapter_id', currentChapter.id)
          .order('sort_order');

        if (error) {
          console.error('Error fetching gallery items:', error);
        } else {
          setGalleryItems(data || []);
        }
      }
    };

    fetchGalleryItems();
  }, [readingState, currentChapter]);

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
        if (currentChapterIndex === 0) {
          if (book.intro) {
            setReadingState('intro');
          } else if (book.dedication) {
            setReadingState('dedication');
          } else {
            setReadingState('cover');
          }
        } else {
          setCurrentChapterIndex(currentChapterIndex - 1);
          setReadingState('chapter-gallery');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {readingState === 'cover' && (
        <BookCover book={book} onNext={handleNext} />
      )}
      
      {readingState === 'dedication' && book.dedication && (
        <BookDedication 
          dedication={book.dedication} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {readingState === 'intro' && book.intro && (
        <BookIntro 
          intro={book.intro} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {readingState === 'chapter-title' && currentChapter && (
        <ChapterTitle 
          chapter={currentChapter} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {readingState === 'chapter-content' && currentChapter && (
        <ChapterReader 
          chapter={currentChapter} 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
        />
      )}
      
      {readingState === 'chapter-gallery' && currentChapter && (
        <ChapterGallery 
          galleryItems={galleryItems}
          onNext={currentChapterIndex < chapters.length - 1 ? handleNext : undefined}
          onPrevious={handlePrevious} 
        />
      )}
    </div>
  );
}
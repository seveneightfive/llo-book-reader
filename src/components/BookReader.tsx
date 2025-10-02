import React, { useState } from 'react';
import { Book, Chapter } from '../lib/supabase';
import BookCover from './BookCover';
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

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [readingState, setReadingState] = useState<ReadingState>({ type: 'cover' });

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

  const handlePrev = () => {
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

  switch (readingState.type) {
    case 'cover':
      return <BookCover book={book} onNext={handleNext} />;
    
    case 'dedication':
      return <BookDedication book={book} onNext={handleNext} onPrev={handlePrev} />;
    
    case 'intro':
      return <BookIntro book={book} onNext={handleNext} onPrev={handlePrev} />;
    
    case 'chapter-title':
      return (
        <ChapterTitle 
          chapter={chapters[readingState.chapterIndex]} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      );
    
    case 'chapter-content':
      return (
        <ChapterReader 
          chapter={chapters[readingState.chapterIndex]} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      );
    
    case 'chapter-gallery':
      return (
        <ChapterGallery 
          chapter={chapters[readingState.chapterIndex]} 
          onNext={handleNext} 
          onPrev={handlePrev} 
        />
      );
    
    default:
      return <BookCover book={book} onNext={handleNext} />;
  }
}
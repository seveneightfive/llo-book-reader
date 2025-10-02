import React, { useState } from 'react';
import { Book, Chapter } from '../lib/supabase';
import BookCover from './BookCover';
import BookIntro from './BookIntro';
import BookDedication from './BookDedication';
import ChapterTitle from './ChapterTitle';
import ChapterReader from './ChapterReader';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

export default function BookReader({ book, chapters }: BookReaderProps) {
  const [currentView, setCurrentView] = useState<'cover' | 'dedication' | 'intro' | 'chapter'>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const handleBeginReading = () => {
    if (book.dedication) {
      setCurrentView('dedication');
    } else if (book.intro) {
      setCurrentView('intro');
    } else {
      setCurrentView('chapter');
    }
  };

  const handleContinueFromDedication = () => {
    if (book.intro) {
      setCurrentView('intro');
    } else {
      setCurrentView('chapter');
    }
  };

  const handleContinueFromIntro = () => {
    setCurrentView('chapter');
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const currentChapter = chapters[currentChapterIndex];

  if (currentView === 'cover') {
    return <BookCover book={book} onBeginReading={handleBeginReading} />;
  }

  if (currentView === 'dedication' && book.dedication) {
    return <BookDedication book={book} onContinue={handleContinueFromDedication} />;
  }

  if (currentView === 'intro' && book.intro) {
    return <BookIntro book={book} onContinue={handleContinueFromIntro} />;
  }

  if (currentView === 'chapter' && currentChapter) {
    return (
      <div>
        <ChapterTitle chapter={currentChapter} />
        <ChapterReader 
          chapter={currentChapter}
          onNext={handleNextChapter}
          onPrevious={handlePreviousChapter}
          hasNext={currentChapterIndex < chapters.length - 1}
          hasPrevious={currentChapterIndex > 0}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-slate-800 mb-2">Loading...</h1>
        <p className="text-slate-600">Preparing your reading experience...</p>
      </div>
    </div>
  );
}
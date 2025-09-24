import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Book, Chapter } from '../lib/supabase';
import { fetchAllPagesForChapters } from '../lib/pdfUtils';
import { BookCover } from './BookCover';
import { BookDedication } from './BookDedication';
import { BookIntro } from './BookIntro';
import { ChapterTitle } from './ChapterTitle';
import { ChapterReader } from './ChapterReader';
import { PdfBookContent } from './PdfBookContent';

interface BookReaderProps {
  book: Book;
  chapters: Chapter[];
}

type ReaderState = 
  | { type: 'cover' }
  | { type: 'dedication' }
  | { type: 'intro' }
  | { type: 'chapter-title'; chapter: number }
  | { type: 'chapter-content'; chapter: number };

export function BookReader({ book, chapters }: BookReaderProps) {
  const [state, setState] = useState<ReaderState>({ type: 'cover' });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const getCurrentChapter = (chapterNumber: number) => {
    return chapters.find(c => c.chapter_number === chapterNumber);
  };

  const getValidChapterNumbers = () => {
    return chapters.map(c => c.chapter_number).sort((a, b) => a - b);
  };

  const getNextValidChapterNumber = (currentNumber: number) => {
    const validNumbers = getValidChapterNumbers();
    const currentIndex = validNumbers.indexOf(currentNumber);
    return currentIndex !== -1 && currentIndex < validNumbers.length - 1 
      ? validNumbers[currentIndex + 1] 
      : null;
  };

  const getPrevValidChapterNumber = (currentNumber: number) => {
    const validNumbers = getValidChapterNumbers();
    const currentIndex = validNumbers.indexOf(currentNumber);
    return currentIndex > 0 ? validNumbers[currentIndex - 1] : null;
  };

  const handleNext = () => {
    switch (state.type) {
      case 'cover':
        setState({ type: 'dedication' });
        break;
      case 'dedication':
        setState({ type: 'intro' });
        break;
      case 'intro':
        setState({ type: 'chapter-title', chapter: 1 });
        break;
      case 'chapter-title':
        setState({ type: 'chapter-content', chapter: state.chapter });
        break;
      case 'chapter-content':
        const nextChapterNumber = getNextValidChapterNumber(state.chapter);
        if (nextChapterNumber !== null) {
          setState({ type: 'chapter-title', chapter: nextChapterNumber });
        }
        break;
    }
  };

  const handlePrev = () => {
    switch (state.type) {
      case 'dedication':
        setState({ type: 'cover' });
        break;
      case 'intro':
        setState({ type: 'dedication' });
        break;
      case 'chapter-title':
        const validNumbers = getValidChapterNumbers();
        if (state.chapter === validNumbers[0]) {
          setState({ type: 'intro' });
        } else {
          const prevChapterNumber = getPrevValidChapterNumber(state.chapter);
          if (prevChapterNumber !== null) {
            setState({ type: 'chapter-content', chapter: prevChapterNumber });
          }
        }
        break;
      case 'chapter-content':
        setState({ type: 'chapter-title', chapter: state.chapter });
        break;
    }
  };

  const handleChapterChange = (chapterNumber: number) => {
    const chapter = getCurrentChapter(chapterNumber);
    if (chapter) {
      setState({ type: 'chapter-title', chapter: chapterNumber });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Fetch all pages for all chapters
      const chaptersWithPages = await fetchAllPagesForChapters(chapters);
      
      // Create a temporary container for the PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      document.body.appendChild(tempContainer);
      
      // Create React element and render it
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      // Render the PDF content
      await new Promise<void>((resolve) => {
        root.render(
          <PdfBookContent book={book} chaptersWithPages={chaptersWithPages} />
        );
        // Give React time to render
        setTimeout(resolve, 3000);
      });
      
      // Configure PDF options
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          floatPrecision: 16
        }
      };
      
      // Generate and download PDF
      await html2pdf().set(opt).from(tempContainer).save();
      
      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* PDF Download Button - Fixed position */}
      {state.type !== 'cover' && (
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
        >
          {isGeneratingPdf ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating PDF...
            </span>
          ) : (
            'Download PDF'
          )}
        </button>
      )}
      
      {/* Loading Overlay */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              Generating PDF
            </h3>
            <p className="text-slate-600">
              Please wait while we create your book PDF. This may take a few moments...
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {state.type === 'cover' && (
          <BookCover key="cover" book={book} onNext={handleNext} />
        )}
        
        {state.type === 'dedication' && (
          <BookDedication 
            key="dedication" 
            book={book} 
            onNext={handleNext} 
            onPrev={handlePrev} 
          />
        )}
        
        {state.type === 'intro' && (
          <BookIntro 
            key="intro" 
            book={book} 
            onNext={handleNext} 
            onPrev={handlePrev} 
          />
        )}
        
        {state.type === 'chapter-title' && getCurrentChapter(state.chapter) && (
          <ChapterTitle 
            key={`chapter-title-${state.chapter}`}
            chapter={getCurrentChapter(state.chapter)!}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        
        {state.type === 'chapter-content' && getCurrentChapter(state.chapter) && (
          <ChapterReader 
            key={`chapter-content-${state.chapter}`}
            chapter={getCurrentChapter(state.chapter)!}
            chapters={chapters}
            bookTitle={book.title}
            onNext={handleNext}
            onPrev={handlePrev}
            onChapterChange={handleChapterChange}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
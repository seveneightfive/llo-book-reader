import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, SquarePen as PenSquare } from 'lucide-react';
import { Book, Chapter } from '../lib/supabase';

interface NavigationMenuProps {
  book: Book;
  chapters: Chapter[];
  currentChapterIndex: number;
  currentState: string;
  onNavigateToChapter: (index: number) => void;
  onNavigateToGallery: () => void;
}

export default function NavigationMenu({
  book,
  chapters,
  currentChapterIndex,
  currentState,
  onNavigateToChapter,
  onNavigateToGallery
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChapterClick = (index: number) => {
    onNavigateToChapter(index);
    setIsOpen(false);
  };

  const handleGalleryClick = () => {
    onNavigateToGallery();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-slate-800" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-avenir font-semibold text-slate-800">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                  <h3 className="text-2xl font-avenir font-bold text-slate-800 mb-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-avenir">by {book.author}</p>
                </div>

                <div>
                  <h4 className="text-sm font-avenir font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Table of Contents
                  </h4>
                  <nav className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterClick(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentState.includes('chapter') && currentChapterIndex === index
                            ? 'bg-slate-800 text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-avenir">
                          <div className="text-xs opacity-75 mb-1">Chapter {chapter.number}</div>
                          <div className="font-medium">{chapter.title}</div>
                        </div>
                      </button>
                    ))}

                    {chapters.length > 0 && (
                      <button
                        onClick={handleGalleryClick}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentState === 'gallery'
                            ? 'bg-slate-800 text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-avenir font-medium">Gallery</div>
                      </button>
                    )}
                  </nav>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 space-y-4">
                {book.filloutform_link && (
                  <button
                    onClick={() => window.open(book.filloutform_link!, '_blank', 'noopener,noreferrer')}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-avenir font-medium"
                  >
                    <PenSquare className="w-5 h-5" />
                    Sign My Guestbook
                  </button>
                )}
                <img
                  src="https://ompmvmjamqekwmnjwnzt.supabase.co/storage/v1/object/public/LLO%20Branding/logo.png"
                  alt="Site Logo"
                  className="w-full max-w-[200px] mx-auto"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, Chapter, Page } from '../lib/supabase';

interface ChapterReaderProps {
  chapter: Chapter;
  onNext: () => void;
  onPrev: () => void;
}

export function ChapterReader({ chapter, onNext, onPrev }: ChapterReaderProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, [chapter.id]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('page_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      onPrev();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600 font-avenir">Loading chapter...</div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-avenir text-slate-800 mb-4">
            Chapter {chapter.chapter_number}: {chapter.title}
          </h2>
          <p className="text-slate-600 mb-8">No content available for this chapter.</p>
          <div className="flex justify-between">
            <button
              onClick={onPrev}
              className="px-6 py-2 font-avenir text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <motion.div
      key={currentPageIndex}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {currentPage.page_title && (
            <h2 className="text-2xl font-avenir text-slate-800 mb-6 heading-tracking">
              {currentPage.page_title}
            </h2>
          )}

          {currentPage.page_image_url && (
            <div className="mb-8">
              <img
                src={currentPage.page_image_url}
                alt={currentPage.page_image_caption || 'Page image'}
                className="w-full max-w-2xl h-64 object-cover rounded-lg shadow-lg mx-auto"
              />
              {currentPage.page_image_caption && (
                <p className="image-caption mt-4">
                  {currentPage.page_image_caption}
                </p>
              )}
            </div>
          )}

          {currentPage.page_quote && (
            <blockquote className="text-xl font-lora italic text-slate-800 mb-8 text-center max-w-3xl mx-auto leading-body-relaxed quote-tracking py-6 bg-slate-50/50 rounded-lg px-8">
              "{currentPage.page_quote}"
              {currentPage.page_quote_attribute && (
                <cite className="block text-sm text-slate-600 mt-4 not-italic">
                  — {currentPage.page_quote_attribute}
                </cite>
              )}
            </blockquote>
          )}

          {currentPage.page_content && (
            <div className="prose prose-lg max-w-none mb-12 px-8">
              <div className="text-body-large font-lora leading-body-relaxed markdown-body">
                {currentPage.page_content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              className="px-6 py-2 font-avenir text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← {currentPageIndex === 0 ? 'Back' : 'Previous'}
            </button>

            <div className="text-sm text-slate-500 font-avenir">
              Page {currentPageIndex + 1} of {pages.length}
            </div>

            <button
              onClick={handleNextPage}
              className="px-6 py-2 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              {currentPageIndex === pages.length - 1 ? 'Continue' : 'Next'} →
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
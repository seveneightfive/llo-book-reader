import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

    fetchPages();
  }, [chapter.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading chapter...</div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{chapter.title}</h2>
            <p className="text-gray-600">No pages found for this chapter.</p>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <button
              onClick={onPrev}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <button
              onClick={onNext}
              className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex">
        {/* Left side - Image */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          {currentPage.page_image_url ? (
            <div className="max-w-full max-h-full">
              <img
                src={currentPage.page_image_url}
                alt={currentPage.page_image_caption || 'Page image'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
              {currentPage.page_image_caption && (
                <p className="text-sm text-gray-600 mt-4 text-center italic">
                  {currentPage.page_image_caption}
                </p>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-gray-500">No Image</span>
              </div>
              <p>No image available for this page</p>
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center">
          <div className="max-w-lg mx-auto">
            {currentPage.page_title && (
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentPage.page_title}
              </h2>
            )}

            {currentPage.page_quote && (
              <blockquote className="text-xl italic text-gray-700 mb-6 border-l-4 border-gray-300 pl-6">
                "{currentPage.page_quote}"
                {currentPage.page_quote_attribute && (
                  <cite className="block text-sm text-gray-600 mt-2 not-italic">
                    — {currentPage.page_quote_attribute}
                  </cite>
                )}
              </blockquote>
            )}

            {currentPage.page_content && (
              <div className="prose prose-gray max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: currentPage.page_content.replace(/\n/g, '<br>')
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handlePrevPage}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {currentPageIndex > 0 ? 'Previous Page' : 'Back'}
          </button>
          
          <div className="text-sm text-gray-500">
            Page {currentPageIndex + 1} of {pages.length}
          </div>
          
          <button
            onClick={handleNextPage}
            className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {currentPageIndex < pages.length - 1 ? 'Next Page' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { marked } from 'marked';
import { Chapter, Page, supabase } from '../lib/supabase';
import { useChapterPages, useChapterGallery } from '../hooks/useBook';
import { ChapterGallery } from './ChapterGallery';

interface ChapterReaderProps {
  chapter: Chapter;
  chapters: Chapter[];
  bookTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onChapterChange: (chapterNumber: number) => void;
  onDownloadPdf: () => void;
}

export function ChapterReader({ chapter, chapters, bookTitle, onPrev, onNext, onChapterChange, onDownloadPdf }: ChapterReaderProps) {
  const { pages, loading } = useChapterPages(chapter.id);
  const { galleryItems, loading: galleryLoading } = useChapterGallery(chapter.id);
  
  // Debug logging for pages
  console.log('ChapterReader - Chapter ID:', chapter.id);
  console.log('ChapterReader - Pages:', pages);
  console.log('ChapterReader - Pages Loading:', loading);
  console.log('ChapterReader - Pages Length:', pages?.length || 0);
  
  // Log each page's content
  pages.forEach((page, index) => {
    console.log(`Page ${index}:`, {
      id: page.id,
      subtitle: page.subtitle,
      content: page.content,
      image_url: page.image_url,
      sort_order: page.sort_order
    });
  });
  
  // Debug logging for gallery
  console.log('ChapterReader - Chapter ID:', chapter.id);
  console.log('ChapterReader - Gallery Items:', galleryItems);
  console.log('ChapterReader - Gallery Loading:', galleryLoading);
  console.log('ChapterReader - Gallery Items Length:', galleryItems?.length || 0);
  
  // Test gallery table access
  useEffect(() => {
    const testGalleryAccess = async () => {
      try {
        const { data, error, count } = await supabase
          .from('gallery')
          .select('*', { count: 'exact' });
        
        console.log('Gallery table test - Total items:', count);
        console.log('Gallery table test - Data:', data);
        console.log('Gallery table test - Error:', error);
      } catch (err) {
        console.error('Gallery table test - Exception:', err);
      }
    };
    
    testGalleryAccess();
  }, []);
  
  // Get chapter image with fallback to default
  const getChapterImageUrl = () => {
    if (chapter.image_url && chapter.image_url.trim() !== '') {
      return chapter.image_url;
    }
    
    // Generate default image URL from Supabase Storage
    const { data } = supabase.storage
      .from('chapter-images')
      .getPublicUrl(`Chapter-${chapter.number}.jpg`);
    
    return data.publicUrl;
  };
  
  const [currentImage, setCurrentImage] = useState<string | null>(getChapterImageUrl());
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastContentElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const contentElement = contentRef.current;
      const containerRect = contentElement.getBoundingClientRect();

      // Find which subtitle is at the top of the viewport
      const subtitleElements = contentElement.querySelectorAll('[data-subtitle-id]');
      let currentSubtitleInView = null;

      subtitleElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        
        // Check if subtitle is at or near the top of the viewport
        if (rect.top <= containerRect.top + 100 && rect.bottom > containerRect.top) {
          currentSubtitleInView = element.getAttribute('data-subtitle-id');
        }
      });

      if (currentSubtitleInView) {
        const currentPage = pages.find(p => p.id.toString() === currentSubtitleInView);
        if (currentPage?.image_url) {
          if (currentPage.image_url !== currentImage) {
            setCurrentImage(currentPage.image_url);
            setCurrentCaption(currentPage.image_caption);
          }
        }
      }

      // Fallback: if no subtitle with image is in view, find any page with image
      if (!currentSubtitleInView) {
        const pageElements = contentElement.querySelectorAll('[data-page-id]');
        pageElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          
          if (rect.top <= containerRect.top + 200 && rect.bottom > containerRect.top) {
            const pageId = element.getAttribute('data-page-id');
            const page = pages.find(p => p.id.toString() === pageId);
            if (page?.image_url && page.image_url !== currentImage) {
              setCurrentImage(page.image_url);
              setCurrentCaption(page.image_caption);
            }
          }
        });
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Initial call to set image
      handleScroll();
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [pages, currentImage]);

  // Group pages by subtitle for better organization
  // Simply display pages in order without complex grouping
  const displayPages = pages;

  // Find first image for initial display
  useEffect(() => {
    if (!currentImage && pages.length > 0) {
      const firstImagePage = pages.find(p => p.image_url);
      if (firstImagePage?.image_url) {
        setCurrentImage(firstImagePage.image_url);
        setCurrentCaption(firstImagePage.image_caption);
      }
    }
  }, [pages, currentImage]);

  // Set up IntersectionObserver to detect when last content is at top of viewport
  useEffect(() => {
    if (!contentRef.current) return;
    
    const lastElement = contentRef.current.querySelector('[data-page-id]:last-child');
    if (!lastElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Show bottom nav when the last content element reaches the top of the viewport
        setShowBottomNav(entry.boundingClientRect.top <= 0);
      },
      {
        root: contentRef.current,
        rootMargin: '0px',
        threshold: 0
      }
    );

    observer.observe(lastElement);

    return () => observer.disconnect();
  }, [pages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Loading chapter...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => setIsNavOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="text-center">
          <p className="text-sm text-slate-500">{bookTitle}</p>
          <p className="font-avenir">
            {chapter.title}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onPrev}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={onNext}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Desktop Image Panel */}
        <div className="hidden lg:block w-1/2 bg-slate-50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentImage && (
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center p-12">
                  <img
                    src={currentImage}
                    alt=""
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                  {currentCaption && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-slate-600 italic text-center leading-relaxed" style={{ fontSize: '0.975rem' }}>
                        {currentCaption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <div 
          ref={contentRef}
          className="w-full lg:w-1/2 overflow-y-auto px-4 lg:px-0"
          style={{ height: 'calc(100vh - 80px)' }}
        >
          <div className="p-4 lg:p-4 max-w-none mx-auto">
            {displayPages.map((page, pageIndex) => (
              <motion.div
                key={page.id}
                data-page-id={page.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pageIndex * 0.1, duration: 0.6 }}
                className="mb-8 lg:mb-12"
              >
                {/* Mobile: Show image first if this page has one */}
                {page.image_url && (
                  <div className="lg:hidden mb-6">
                    <div>
                      <img
                        src={page.image_url}
                        alt=""
                        className="w-full rounded-lg shadow-md"
                      />
                      {page.image_caption && (
                        <p className="text-slate-600 italic mt-2 text-center" style={{ fontSize: '0.975rem' }}>
                          {page.image_caption}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Subtitle */}
                {page.subtitle && page.subtitle.trim() !== '' && (
                  <h3 
                    data-subtitle-id={page.id}
                    className="text-2xl lg:text-3xl font-avenir text-slate-800 mb-8 heading-tracking"
                  >
                    {page.subtitle}
                  </h3>
                )}
                
                {/* Page Content */}
                {page.content && page.content.trim() !== '' && (
                  <div className="mb-6">
                    {page.content.includes('"') && page.content.trim().length < 500 ? (
                      <blockquote className="border-l-4 border-slate-300 pl-8 py-6 bg-slate-50/70 rounded-r-lg my-8 mx-4">
                        <div 
                          className="text-body-large font-lora italic leading-body-relaxed quote-tracking"
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(page.content)
                          }}
                        />
                      </blockquote>
                    ) : (
                      <div 
                        className="max-w-none mb-8 markdown-body"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(page.content)
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Spacer to allow last content to scroll to top on desktop */}
            <div className="hidden lg:block" style={{ height: 'calc(100vh - 80px)' }} />
          </div>
          
          {/* Chapter Gallery - Outside the main content container */}
          <div className="px-4 lg:px-4 pb-16">
            {galleryLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading gallery...</p>
              </div>
            ) : galleryItems && galleryItems.length > 0 && (
              <ChapterGallery 
                galleryItems={galleryItems} 
                chapterTitle={chapter.title}
              />
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation - Desktop Only */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 right-0 bg-white p-4 border-t border-l border-slate-200 hidden lg:flex justify-between items-center z-40 shadow-lg"
            style={{ width: '50%' }}
          >
            <button
              onClick={onPrev}
              className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-avenir hover:bg-slate-200 transition-colors"
            >
              ← Previous Chapter
            </button>
            
            <button
              onClick={onNext}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              Next Chapter →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Off-canvas Navigation */}
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsNavOpen(false)}
            />
            
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 
                      className="text-sm font-avenir text-slate-500 mb-1"
                    >
                      {bookTitle}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsNavOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {chapters.map((chap) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      onChapterChange(chap.number);
                      setIsNavOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-2 ${
                      chap.id === chapter.id 
                        ? 'bg-slate-800 text-white' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm opacity-70 mb-1">
                      Chapter {chap.number}
                    </div>
                    <div 
                      className="font-avenir text-sm"
                    >
                      {chap.lede || chap.title}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Download PDF Button */}
              <div className="p-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    onDownloadPdf();
                    setIsNavOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center font-avenir"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
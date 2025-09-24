import { Book } from '../lib/supabase';
import { ChapterWithPages } from '../lib/pdfUtils';

interface PdfBookContentProps {
  book: Book;
  chaptersWithPages: ChapterWithPages[];
}

export function PdfBookContent({ book, chaptersWithPages }: PdfBookContentProps) {
  return (
    <div className="bg-white text-black font-serif leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Book Cover Page */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-16 page-break-after">
        <div className="max-w-2xl">
          {book.cover_image && (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-64 h-96 object-cover mx-auto mb-12 shadow-lg"
            />
          )}
          <h1 className="text-6xl font-light mb-8 text-gray-900">
            {book.title}
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            by {book.author}
          </p>
        </div>
      </div>

      {/* Dedication Page */}
      {book.dedication && (
        <div className="min-h-screen flex items-center justify-center p-16 page-break-after">
          <div className="max-w-2xl text-center">
            <h2 className="text-3xl font-light mb-12 text-gray-800">
              Dedication
            </h2>
            <blockquote className="text-xl leading-relaxed text-gray-700 italic">
              {book.dedication}
            </blockquote>
          </div>
        </div>
      )}

      {/* Introduction Page */}
      {book.intro && (
        <div className="min-h-screen flex items-center justify-center p-16 page-break-after">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-light mb-12 text-center text-gray-800">
              Introduction
            </h2>
            <div className="prose prose-xl max-w-none">
              <p className="text-lg leading-relaxed text-gray-700">
                {book.intro}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chapters */}
      {chaptersWithPages.map((chapter, chapterIndex) => (
        <div key={chapter.id}>
          {/* Chapter Title Page */}
          <div className="min-h-screen flex items-center justify-center p-16 page-break-after">
            <div className="max-w-3xl text-center">
              <p className="text-lg tracking-wider text-gray-500 uppercase mb-6">
                Chapter {chapter.chapter_number}
              </p>
              <h1 className="text-5xl font-light mb-8 text-gray-900">
                {chapter.title}
              </h1>
              {chapter.lede && (
                <p className="text-xl leading-relaxed text-gray-700 mb-8">
                  {chapter.lede}
                </p>
              )}
              {chapter.chapter_image && (
                <img
                  src={chapter.chapter_image}
                  alt={chapter.title}
                  className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>

          {/* Chapter Content */}
          <div className="p-16">
            <div className="max-w-4xl mx-auto">
              {/* Chapter Header */}
              <div className="mb-12 pb-6 border-b border-gray-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light text-gray-800">
                    Chapter {chapter.chapter_number}: {chapter.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Page {chapterIndex + 1}
                  </div>
                </div>
              </div>

              {/* Pages Content */}
              {chapter.pages.map((page, pageIndex) => (
                <div key={page.id} className="mb-8">
                  {page.type === 'subheading' && page.content && (
                    <h3 className="text-3xl font-light text-gray-800 mb-6 mt-12">
                      {page.content}
                    </h3>
                  )}
                  
                  {page.type === 'content' && page.content && (
                    <div className="mb-6">
                      {page.image && (
                        <div className="mb-6">
                          <img
                            src={page.image}
                            alt=""
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                          />
                          {page.image_caption && (
                            <p className="text-sm text-gray-600 italic text-center mt-3">
                              {page.image_caption}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-lg leading-relaxed text-gray-700 mb-4">
                        {page.content}
                      </p>
                    </div>
                  )}
                  
                  {page.type === 'quote' && page.content && (
                    <blockquote className="border-l-4 border-gray-800 pl-8 py-6 my-8 bg-gray-50">
                      <p className="text-xl italic text-gray-700 leading-relaxed">
                        {page.content}
                      </p>
                    </blockquote>
                  )}
                  
                  {page.type === 'image' && page.image && (
                    <div className="my-8">
                      <img
                        src={page.image}
                        alt=""
                        className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
                      />
                      {page.image_caption && (
                        <p className="text-sm text-gray-600 italic text-center mt-3">
                          {page.image_caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Footer for each page */}
      <style jsx>{`
        .page-break-after {
          page-break-after: always;
        }
        
        @media print {
          .page-break-after {
            page-break-after: always;
          }
          
          body {
            font-size: 12pt;
            line-height: 1.6;
          }
          
          h1 { font-size: 24pt; }
          h2 { font-size: 20pt; }
          h3 { font-size: 16pt; }
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
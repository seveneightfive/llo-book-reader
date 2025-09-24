import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import { Book } from '../lib/supabase';
import { ChapterWithPages } from '../lib/pdfUtils';

// Configure marked options for better HTML output
marked.setOptions({
  breaks: true, // Convert single line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
});

// Helper function to safely parse markdown content
const parseMarkdown = (content: string | null): string => {
  if (!content) return '';
  return marked.parse(content);
};

// Helper function to escape HTML but preserve markdown
const sanitizeContent = (content: string | null): string => {
  if (!content) return '';
  // Let marked handle the markdown parsing and HTML generation
  return parseMarkdown(content);
};

export const generateBookPDF = async (book: Book, chaptersWithPages: ChapterWithPages[]): Promise<void> => {
  try {
    // Generate complete HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${book.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Lora', Georgia, 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #212121;
            max-width: 100%;
            margin: 0;
            padding: 20px;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .cover-page {
            text-align: center;
            padding: 60px 0;
            page-break-after: always;
          }
          
          .cover-image {
            max-width: 300px;
            max-height: 400px;
            margin: 0 auto 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .book-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 28pt;
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 15px;
            letter-spacing: 0.025em;
          }
          
          .book-author {
            font-size: 16pt;
            color: #64748b;
            margin-bottom: 20px;
          }
          
          .dedication-page, .intro-page {
            padding: 40px 0;
            page-break-after: always;
          }
          
          .dedication-title, .intro-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 18pt;
            font-weight: 500;
            text-align: center;
            margin-bottom: 30px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #64748b;
          }
          
          .dedication-content {
            font-style: italic;
            text-align: center;
            font-size: 12pt;
            line-height: 1.7;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: #f8fafc;
            border-radius: 8px;
          }
          
          .toc-page {
            page-break-after: always;
            padding: 40px 0;
          }
          
          .toc-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 18pt;
            font-weight: 500;
            margin-bottom: 30px;
            color: #1e293b;
          }
          
          .toc-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12pt;
          }
          
          .chapter-title-page {
            text-align: center;
            padding: 80px 0;
            page-break-before: always;
            page-break-after: always;
          }
          
          .chapter-image {
            max-width: 400px;
            max-height: 300px;
            margin: 0 auto 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .chapter-number {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 48pt;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
          }
          
          .chapter-label {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 8pt;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 30px;
          }
          
          .chapter-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 20pt;
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 20px;
            letter-spacing: 0.025em;
          }
          
          .chapter-intro {
            font-style: italic;
            font-size: 12pt;
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.7;
          }
          
          .chapter-content {
            padding: 0;
          }
          
          .content-block {
            margin-bottom: 20px;
          }
          
          .content-image {
            max-width: 100%;
            height: auto;
            margin: 20px auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .image-caption {
            font-size: 9pt;
            font-style: italic;
            text-align: center;
            color: #64748b;
            margin-top: 8px;
            margin-bottom: 20px;
          }
          
          .subheading {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14pt;
            font-weight: 500;
            color: #1e293b;
            margin: 30px 0 15px 0;
            letter-spacing: 0.025em;
          }
          
          .content-text {
            font-size: 11pt;
            line-height: 1.6;
            margin-bottom: 12px;
            text-align: justify;
          }
          
          .content-quote {
            font-size: 12pt;
            font-style: italic;
            line-height: 1.7;
            margin: 25px 0;
            padding: 20px 30px;
            border-left: 4px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 0 8px 8px 0;
            letter-spacing: 0.01em;
          }
          
          /* Markdown styling */
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-weight: 500;
            color: #1e293b;
            margin: 20px 0 10px 0;
            letter-spacing: 0.025em;
          }
          
          h1 { font-size: 18pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
          h4 { font-size: 12pt; }
          h5 { font-size: 11pt; }
          h6 { font-size: 10pt; }
          
          p {
            margin-bottom: 12px;
            text-align: justify;
          }
          
          strong, b {
            font-weight: 500;
            color: #1e293b;
          }
          
          em, i {
            font-style: italic;
          }
          
          ul, ol {
            margin: 12px 0;
            padding-left: 20px;
          }
          
          li {
            margin-bottom: 6px;
          }
          
          blockquote {
            margin: 20px 0;
            padding: 15px 25px;
            border-left: 4px solid #cbd5e1;
            background: #f8fafc;
            font-style: italic;
          }
          
          code {
            font-family: 'Courier New', monospace;
            background: #f1f5f9;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 10pt;
          }
          
          pre {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
          }
          
          pre code {
            background: none;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="cover-page">
          ${book.cover_image ? `<img src="${book.cover_image}" alt="${book.title}" class="cover-image">` : ''}
          <h1 class="book-title">${sanitizeContent(book.title)}</h1>
          <p class="book-author">by ${sanitizeContent(book.author)}</p>
          ${book.description ? `<div class="book-description">${sanitizeContent(book.description)}</div>` : ''}
        </div>

        <!-- Dedication Page -->
        ${book.dedication ? `
        <div class="dedication-page">
          <h2 class="dedication-title">Dedication</h2>
          <div class="dedication-content">
            ${sanitizeContent(book.dedication)}
          </div>
        </div>
        ` : ''}

        <!-- Introduction Page -->
        ${book.intro ? `
        <div class="intro-page">
          <h2 class="intro-title">Introduction</h2>
          <div class="intro-content">
            ${sanitizeContent(book.intro)}
          </div>
        </div>
        ` : ''}

        <!-- Table of Contents -->
        <div class="toc-page">
          <h2 class="toc-title">Table of Contents</h2>
          ${chaptersWithPages.filter(chapter => chapter.pages.length > 0).map(chapter => `
            <div class="toc-item">
              <span>Chapter ${chapter.chapter_number}: ${sanitizeContent(chapter.title)}</span>
              <span>${chapter.pages.length} sections</span>
            </div>
          `).join('')}
        </div>

        <!-- Chapters -->
        ${chaptersWithPages.filter(chapter => chapter.pages.length > 0).map(chapter => `
          <!-- Chapter Title Page -->
          <div class="chapter-title-page">
            ${chapter.chapter_image ? `<img src="${chapter.chapter_image}" alt="${chapter.title}" class="chapter-image">` : ''}
            <div class="chapter-number">${chapter.chapter_number}</div>
            <div class="chapter-label">Chapter</div>
            <h1 class="chapter-title">${sanitizeContent(chapter.title)}</h1>
            ${chapter.intro || chapter.lede ? `
              <div class="chapter-intro">
                ${sanitizeContent(chapter.intro || chapter.lede || '')}
              </div>
            ` : ''}
          </div>

          <!-- Chapter Content -->
          <div class="chapter-content">
            ${chapter.pages.map(page => `
              <div class="content-block">
                ${page.image_url ? `
                  <img src="${page.image_url}" alt="" class="content-image">
                  ${page.image_caption ? `<div class="image-caption">${sanitizeContent(page.image_caption)}</div>` : ''}
                ` : ''}
                
                ${page.subheading ? `<h3 class="subheading">${sanitizeContent(page.subheading)}</h3>` : ''}
                
                ${page.quote ? `<div class="content-quote">${sanitizeContent(page.quote)}</div>` : ''}
                
                ${page.content ? `<div class="content-text">${sanitizeContent(page.content)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    // Configure html2pdf options
    const options = {
      margin: [15, 15, 15, 15], // top, right, bottom, left in mm
      filename: `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.85 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break',
        after: '.chapter-title-page'
      }
    };

    // Generate and download PDF
    await html2pdf()
      .set(options)
      .from(htmlContent)
      .save();

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const downloadBookPDF = async (book: Book, chaptersWithPages: ChapterWithPages[]): Promise<void> => {
  try {
    await generateBookPDF(book, chaptersWithPages);
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
};
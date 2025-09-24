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
            position: relative;
            height: 100%;
            width: 100%;
            overflow: hidden;
            page-break-after: always;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          
          .cover-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          }
          
          .cover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            padding: 0.5in;
            padding-top: 1in;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 2;
          }
          
          .cover-title-box {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 15px 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            max-width: 80%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          
          .book-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 18pt;
            font-weight: 500;
            color: #1e293b;
            margin: 0;
            letter-spacing: 0.025em;
          }
          
          .book-author {
            font-size: 10pt;
            color: #64748b;
            font-style: italic;
            margin: 0;
          }
          
          .dedication-page, .intro-page {
            padding: 40px 0;
            page-break-after: always;
          }
          
          .dedication-title, .intro-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14pt;
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
            max-width: 300px;
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
            font-size: 14pt;
            font-weight: 500;
            margin-bottom: 30px;
            color: #1e293b;
          }
          
          .chapter-entry {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          
          .chapter-circle {
            width: 24px;
            height: 24px;
            background-color: #1e293b;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10pt;
            font-weight: 500;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .chapter-text {
            flex: 1;
          }
          
          .chapter-title-toc {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 12pt;
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 2px;
            line-height: 1.3;
          }
          
          .chapter-lede-toc {
            font-size: 10pt;
            color: #64748b;
            font-style: italic;
            line-height: 1.4;
          }
          
          .chapter-image-page {
            page-break-before: always;
            page-break-after: always;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            padding: 0;
            margin: 0;
          }
          
          .chapter-image-full {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          
          .chapter-title-page {
            text-align: center;
            padding: 80px 0;
            page-break-before: always;
            page-break-after: always;
          }
          
          .chapter-number {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 24pt;
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
            margin-top: 10px;
            margin-bottom: 30px;
          }
          
          .chapter-title {
            font-family: 'Avenir Next', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 16pt;
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 20px;
            letter-spacing: 0.025em;
          }
          
          .chapter-intro {
            text-align: center;
            font-style: italic;
            font-size: 10pt;
            color: #64748b;
            max-width: 300px;
            margin: 0 auto;
            line-height: 1.7;
          }
          
          .chapter-content {
            page-break-before: always;
            padding: 0;
          }
          
          .content-block {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }
          
          .content-image-container {
            page-break-inside: avoid;
            display: block;
            margin: 20px auto;
          }
          
          .content-image {
            max-width: 100%;
            max-height: 4.0in;
            height: auto;
            object-fit: contain;
            margin: 0 auto;
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
            margin-bottom: 0;
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
          
          h1 { font-size: 14pt; }
          h2 { font-size: 13pt; }
          h3 { font-size: 12pt; }
          h4 { font-size: 11pt; }
          h5 { font-size: 10pt; }
          h6 { font-size: 9pt; }
          
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
        <div class="cover-page" ${book.cover_image ? `style="background-image: url('${book.cover_image}')"` : ''}>
          <div class="cover-overlay">
            <div class="cover-title-box">
              <h1 class="book-title">The Journey of A Life</h1>
              <p class="book-author">by ${sanitizeContent(book.author)}</p>
            </div>
          </div>
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
            <div class="chapter-entry">
              <div class="chapter-circle">${chapter.chapter_number}</div>
              <div class="chapter-text">
                <div class="chapter-title-toc">${sanitizeContent(chapter.title)}</div>
                ${chapter.lede ? `<div class="chapter-lede-toc">${sanitizeContent(chapter.lede)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Chapters -->
        ${chaptersWithPages.filter(chapter => chapter.pages.length > 0).map(chapter => `
          <!-- Chapter Image Page -->
          ${chapter.chapter_image ? `
          <div class="chapter-image-page">
            <img src="${chapter.chapter_image}" alt="${chapter.title}" class="chapter-image-full">
          </div>
          ` : ''}

          <!-- Chapter Title Page -->
          <div class="chapter-title-page">
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
                  <div class="content-image-container">
                    <img src="${page.image_url}" alt="" class="content-image">
                    ${page.image_caption ? `<div class="image-caption">${sanitizeContent(page.image_caption)}</div>` : ''}
                  </div>
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
      margin: [0.5, 0.5, 0.5, 0.5], // top, right, bottom, left in inches
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
        unit: 'in', 
        format: [4.25, 5.5], 
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
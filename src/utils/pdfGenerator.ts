import jsPDF from 'jspdf';
import { Book } from '../lib/supabase';
import { ChapterWithPages } from '../lib/pdfUtils';

// Helper function to load images asynchronously
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS for external images
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// Helper function to add image to PDF
const addImageToPdf = async (
  pdf: jsPDF, 
  imageUrl: string, 
  x: number, 
  currentY: number, 
  maxWidth: number, 
  pageHeight: number, 
  margin: number,
  caption?: string | null
): Promise<number> => {
  try {
    const img = await loadImage(imageUrl);
    
    // Calculate dimensions to fit within content area while maintaining aspect ratio
    const imgAspectRatio = img.width / img.height;
    let imgWidth = Math.min(maxWidth, maxWidth);
    let imgHeight = imgWidth / imgAspectRatio;
    
    // Calculate caption height if caption exists
    let captionHeight = 0;
    if (caption) {
      pdf.setFontSize(9);
      const captionLines = pdf.splitTextToSize(caption, maxWidth);
      captionHeight = captionLines.length * (9 * 0.35) + 5; // font size * line height + spacing
    }
    
    // If image is too tall for remaining space, scale it down
    const remainingSpace = pageHeight - currentY - margin - captionHeight;
    if (imgHeight > remainingSpace - 20) { // Leave some space for text
      imgHeight = Math.min(imgHeight, remainingSpace - 20);
      imgWidth = imgHeight * imgAspectRatio;
    }
    
    // Check if we need a new page (considering both image and caption)
    if (currentY + imgHeight + captionHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
    
    // Center the image horizontally
    const imgX = x + (maxWidth - imgWidth) / 2;
    
    // Add image to PDF
    pdf.addImage(img, 'JPEG', imgX, currentY, imgWidth, imgHeight);
    
    let newY = currentY + imgHeight + 10;
    
    // Add caption if it exists
    if (caption) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      const captionLines = pdf.splitTextToSize(caption, maxWidth);
      const lineHeight = 9 * 0.35;
      
      captionLines.forEach((line: string, index: number) => {
        pdf.text(line, x + (maxWidth / 2), newY + (index * lineHeight), { align: 'center' });
      });
      
      newY += captionLines.length * lineHeight + 5;
    }
    
    return newY;
  } catch (error) {
    console.warn(`Failed to add image to PDF: ${imageUrl}`, error);
    return currentY; // Return original position if image fails
  }
};

export const generateBookPDF = async (book: Book, chaptersWithPages: ChapterWithPages[]): Promise<void> => {
  try {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12, fontStyle: string = 'normal'): number => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.35; // Convert pt to mm
      
      lines.forEach((line: string, index: number) => {
        if (y + (index * lineHeight) > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, x, y + (index * lineHeight));
      });
      
      return y + (lines.length * lineHeight);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number): number => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        return margin;
      }
      return yPosition;
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(book.title, contentWidth);
    titleLines.forEach((line: string, index: number) => {
      pdf.text(line, pageWidth / 2, 60 + (index * 10), { align: 'center' });
    });

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`by ${book.author}`, pageWidth / 2, 80 + (titleLines.length * 10), { align: 'center' });

    // Add cover image
    if (book.cover_image) {
      yPosition = 100 + (titleLines.length * 10);
      yPosition = await addImageToPdf(pdf, book.cover_image, margin, yPosition, contentWidth, pageHeight, margin);
    }

    // Description
    if (book.description) {
      yPosition = checkNewPage(30);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'italic');
      yPosition = addWrappedText(book.description, margin, yPosition, contentWidth, 12, 'italic');
    }

    // Dedication
    if (book.dedication) {
      yPosition = checkNewPage(30);
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dedication', margin, yPosition);
      yPosition += 10;
      yPosition = addWrappedText(book.dedication, margin, yPosition, contentWidth, 11, 'italic');
    }

    // Introduction
    if (book.intro) {
      pdf.addPage();
      yPosition = margin;
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Introduction', margin, yPosition);
      yPosition += 15;
      yPosition = addWrappedText(book.intro, margin, yPosition, contentWidth, 11);
    }

    // Table of Contents
    pdf.addPage();
    yPosition = margin;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Table of Contents', margin, yPosition);
    yPosition += 15;

    // Filter chapters with pages for TOC
    const validChapters = chaptersWithPages.filter(chapter => chapter.pages.length > 0);
    
    for (const chapter of validChapters) {
      yPosition = checkNewPage(10);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Chapter ${chapter.chapter_number}: ${chapter.title}`, margin, yPosition);
      pdf.text(`${chapter.pages.length} pages`, pageWidth - margin - 30, yPosition);
      yPosition += 8;
    }

    // Chapters and Pages
    for (const chapter of validChapters) {
      // Chapter title page
      pdf.addPage();
      yPosition = margin + 40;
      
      // Add chapter image if exists
      if (chapter.chapter_image) {
        yPosition = await addImageToPdf(pdf, chapter.chapter_image, margin, yPosition, contentWidth, pageHeight, margin);
        yPosition += 10;
      }
      
      // Chapter number
      pdf.setFontSize(48);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${chapter.chapter_number}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('CHAPTER', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const chapterTitleLines = pdf.splitTextToSize(chapter.title, contentWidth);
      chapterTitleLines.forEach((line: string, index: number) => {
        pdf.text(line, pageWidth / 2, yPosition + (index * 8), { align: 'center' });
      });

      // Chapter intro/lede
      if (chapter.intro || chapter.lede) {
        yPosition += (chapterTitleLines.length * 8) + 15;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'italic');
        const introText = chapter.intro || chapter.lede;
        yPosition = addWrappedText(introText!, margin, yPosition, contentWidth, 12, 'italic');
      }

      // Chapter content - reflowable pages
      const blockSpacing = 10;
      let isFirstContentBlock = true;
      
      for (const page of chapter.pages) {
        // Check if we need spacing before this content block
        if (!isFirstContentBlock) {
          yPosition = checkNewPage(blockSpacing);
          yPosition += blockSpacing;
        }
        isFirstContentBlock = false;

        // Add page image if exists
        if (page.image_url) {
          yPosition = checkNewPage(100); // Ensure space for image
          yPosition = await addImageToPdf(pdf, page.image_url, margin, yPosition, contentWidth, pageHeight, margin, page.image_caption);
          yPosition += blockSpacing;
        }

        // Subheading
        if (page.subheading) {
          yPosition = checkNewPage(20);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          yPosition = addWrappedText(page.subheading, margin, yPosition, contentWidth, 14, 'bold');
          yPosition += blockSpacing;
        }

        // Quote
        if (page.quote) {
          yPosition = checkNewPage(30);
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'italic');
          
          // Add quote marks and center the quote
          const quoteText = `"${page.quote}"`;
          yPosition = addWrappedText(quoteText, margin, yPosition, contentWidth, 16, 'italic');
          yPosition += blockSpacing;
        }

        // Page content
        if (page.content) {
          const paragraphs = page.content.split('\n\n');
          for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            if (paragraph.trim()) {
              yPosition = checkNewPage(20);
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'normal');
              yPosition = addWrappedText(paragraph.trim(), margin, yPosition, contentWidth, 11);
              // Add spacing between paragraphs, but not after the last one
              if (i < paragraphs.length - 1) {
                yPosition += 8;
              }
            }
          }
        }
      }
    }

    // Footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);

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
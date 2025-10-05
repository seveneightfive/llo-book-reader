import jsPDF from 'jspdf';
import { marked } from 'marked';
import { BookWithFullData, ChapterWithFullData, loadImageAsBase64, getImageDimensions } from './bookDataFetcher';

const SITE_ICON_URL = 'https://ompmvmjamqekwmnjwnzt.supabase.co/storage/v1/object/public/LLO%20Branding/logo.png';

const PDF_CONFIG = {
  width: 396,
  height: 612,
  margin: 30,
  contentWidth: 336,
  pageNumberBottomMargin: 20,
  imageMaxWidth: 336,
  galleryImagesPerRow: 2,
  galleryImageSpacing: 10
};

interface PageTracker {
  currentPage: number;
  shouldShowPageNumber: boolean;
}

function stripHtmlTags(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function parseMarkdownToText(markdown: string): string {
  const html = marked.parse(markdown) as string;
  return stripHtmlTags(html);
}

function addPageNumber(pdf: jsPDF, pageNum: number) {
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    pageNum.toString(),
    PDF_CONFIG.width / 2,
    PDF_CONFIG.height - PDF_CONFIG.pageNumberBottomMargin,
    { align: 'center' }
  );
  pdf.setTextColor(0, 0, 0);
}

function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  return pdf.splitTextToSize(text, maxWidth);
}

function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (maxWidth / width) * height;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width;
    height = maxHeight;
  }

  return { width, height };
}

async function addCoverPage(
  pdf: jsPDF,
  bookData: BookWithFullData,
  tracker: PageTracker
): Promise<void> {
  try {
    if (bookData.book.image_url) {
      const coverImage = await loadImageAsBase64(bookData.book.image_url);
      const imgDimensions = await getImageDimensions(bookData.book.image_url);

      const scale = Math.max(
        PDF_CONFIG.width / imgDimensions.width,
        PDF_CONFIG.height / imgDimensions.height
      );
      const scaledWidth = imgDimensions.width * scale;
      const scaledHeight = imgDimensions.height * scale;
      const x = (PDF_CONFIG.width - scaledWidth) / 2;
      const y = (PDF_CONFIG.height - scaledHeight) / 2;

      pdf.addImage(coverImage, 'JPEG', x, y, scaledWidth, scaledHeight);

      pdf.setFillColor(0, 0, 0);
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.rect(0, 0, PDF_CONFIG.width, PDF_CONFIG.height, 'F');
      pdf.setGState(pdf.GState({ opacity: 1.0 }));
    } else {
      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, 0, PDF_CONFIG.width, PDF_CONFIG.height, 'F');
    }

    const titleY = PDF_CONFIG.height * 0.7;
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');

    const titleLines = wrapText(pdf, bookData.book.title, PDF_CONFIG.contentWidth);
    let currentY = titleY;
    titleLines.forEach(line => {
      pdf.text(line, PDF_CONFIG.width / 2, currentY, { align: 'center' });
      currentY += 12;
    });

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`by ${bookData.book.author}`, PDF_CONFIG.width / 2, currentY + 10, { align: 'center' });

    pdf.setTextColor(0, 0, 0);
    tracker.currentPage = 1;
  } catch (error) {
    console.error('Error adding cover page:', error);
  }
}

async function addBlankPage(pdf: jsPDF, tracker: PageTracker): Promise<void> {
  pdf.addPage();
  tracker.currentPage++;
}

async function addBlankPageWithIcon(pdf: jsPDF, tracker: PageTracker): Promise<void> {
  pdf.addPage();
  tracker.currentPage++;

  try {
    const iconImage = await loadImageAsBase64(SITE_ICON_URL);
    const iconWidth = 80;
    const iconHeight = 40;
    const x = (PDF_CONFIG.width - iconWidth) / 2;
    const y = (PDF_CONFIG.height - iconHeight) / 2;

    pdf.addImage(iconImage, 'PNG', x, y, iconWidth, iconHeight);
  } catch (error) {
    console.error('Error adding icon to blank page:', error);
  }
}

async function addTitlePage(pdf: jsPDF, bookData: BookWithFullData, tracker: PageTracker): Promise<void> {
  pdf.addPage();
  tracker.currentPage++;

  const centerY = PDF_CONFIG.height / 2 - 40;

  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  const titleLines = wrapText(pdf, bookData.book.title, PDF_CONFIG.contentWidth);
  let currentY = centerY;
  titleLines.forEach(line => {
    pdf.text(line, PDF_CONFIG.width / 2, currentY, { align: 'center' });
    currentY += 16;
  });

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`by ${bookData.book.author}`, PDF_CONFIG.width / 2, currentY + 20, { align: 'center' });
}

async function addDedicationPage(
  pdf: jsPDF,
  bookData: BookWithFullData,
  tracker: PageTracker
): Promise<void> {
  if (!bookData.book.dedication) return;

  pdf.addPage();
  tracker.currentPage++;

  const dedicationText = parseMarkdownToText(bookData.book.dedication);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Dedication', PDF_CONFIG.width / 2, 80, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const lines = wrapText(pdf, dedicationText, PDF_CONFIG.contentWidth - 40);
  let y = 110;

  lines.forEach(line => {
    pdf.text(line, PDF_CONFIG.width / 2, y, { align: 'center' });
    y += 7;
  });
}

async function addIntroPage(
  pdf: jsPDF,
  bookData: BookWithFullData,
  tracker: PageTracker
): Promise<void> {
  if (!bookData.book.intro) return;

  pdf.addPage();
  tracker.currentPage++;
  tracker.shouldShowPageNumber = true;

  const introText = parseMarkdownToText(bookData.book.intro);

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Introduction', PDF_CONFIG.width / 2, PDF_CONFIG.margin + 10, { align: 'center' });

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const lines = wrapText(pdf, introText, PDF_CONFIG.contentWidth);
  let y = PDF_CONFIG.margin + 40;

  lines.forEach(line => {
    if (y > PDF_CONFIG.height - 60) {
      addPageNumber(pdf, tracker.currentPage);
      pdf.addPage();
      tracker.currentPage++;
      y = PDF_CONFIG.margin;
    }
    pdf.text(line, PDF_CONFIG.margin, y);
    y += 6;
  });

  addPageNumber(pdf, tracker.currentPage);
}

async function ensureOddPage(pdf: jsPDF, tracker: PageTracker): Promise<void> {
  if (tracker.currentPage % 2 === 0) {
    await addBlankPageWithIcon(pdf, tracker);
  }
}

async function addChapterTitlePage(
  pdf: jsPDF,
  chapter: ChapterWithFullData,
  tracker: PageTracker
): Promise<void> {
  await ensureOddPage(pdf, tracker);

  pdf.addPage();
  tracker.currentPage++;

  let currentY = PDF_CONFIG.margin + 20;

  if (chapter.image_url) {
    try {
      const chapterImage = await loadImageAsBase64(chapter.image_url);
      const imgDimensions = await getImageDimensions(chapter.image_url);

      const maxHeight = (PDF_CONFIG.height * 2) / 3 - 40;
      const dims = calculateImageDimensions(
        imgDimensions.width,
        imgDimensions.height,
        PDF_CONFIG.imageMaxWidth,
        maxHeight
      );

      const x = (PDF_CONFIG.width - dims.width) / 2;
      pdf.addImage(chapterImage, 'JPEG', x, currentY, dims.width, dims.height);
      currentY += dims.height + 20;
    } catch (error) {
      console.error('Error adding chapter image:', error);
      currentY = PDF_CONFIG.height * 0.6;
    }
  } else {
    currentY = PDF_CONFIG.height * 0.4;
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Chapter ${chapter.number}`, PDF_CONFIG.width / 2, currentY, { align: 'center' });
  currentY += 15;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  const titleLines = wrapText(pdf, chapter.title, PDF_CONFIG.contentWidth);
  titleLines.forEach(line => {
    pdf.text(line, PDF_CONFIG.width / 2, currentY, { align: 'center' });
    currentY += 12;
  });

  if (chapter.lede) {
    currentY += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(60, 60, 60);
    const ledeLines = wrapText(pdf, chapter.lede, PDF_CONFIG.contentWidth - 40);
    ledeLines.forEach(line => {
      pdf.text(line, PDF_CONFIG.width / 2, currentY, { align: 'center' });
      currentY += 7;
    });
  }

  pdf.setTextColor(0, 0, 0);
}

async function addChapterContent(
  pdf: jsPDF,
  chapter: ChapterWithFullData,
  tracker: PageTracker
): Promise<void> {
  for (const page of chapter.pages) {
    pdf.addPage();
    tracker.currentPage++;
    let y = PDF_CONFIG.margin;

    if (page.image_url && page.image_caption) {
      try {
        const pageImage = await loadImageAsBase64(page.image_url);
        const imgDimensions = await getImageDimensions(page.image_url);

        const maxHeight = PDF_CONFIG.height - 100;
        const dims = calculateImageDimensions(
          imgDimensions.width,
          imgDimensions.height,
          PDF_CONFIG.imageMaxWidth,
          maxHeight
        );

        const x = (PDF_CONFIG.width - dims.width) / 2;
        pdf.addImage(pageImage, 'JPEG', x, y, dims.width, dims.height);
        y += dims.height + 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(80, 80, 80);
        const captionLines = wrapText(pdf, page.image_caption, PDF_CONFIG.contentWidth);
        captionLines.forEach(line => {
          pdf.text(line, PDF_CONFIG.width / 2, y, { align: 'center' });
          y += 6;
        });
        pdf.setTextColor(0, 0, 0);

        addPageNumber(pdf, tracker.currentPage);

        pdf.addPage();
        tracker.currentPage++;
        y = PDF_CONFIG.margin;
      } catch (error) {
        console.error('Error adding page image:', error);
      }
    }

    if (page.subtitle) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const subtitleLines = wrapText(pdf, page.subtitle, PDF_CONFIG.contentWidth);
      subtitleLines.forEach(line => {
        if (y > PDF_CONFIG.height - 60) {
          addPageNumber(pdf, tracker.currentPage);
          pdf.addPage();
          tracker.currentPage++;
          y = PDF_CONFIG.margin;
        }
        pdf.text(line, PDF_CONFIG.margin, y);
        y += 10;
      });
      y += 5;
    }

    if (page.quote) {
      const quoteText = parseMarkdownToText(page.quote);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(60, 60, 60);
      const quoteLines = wrapText(pdf, quoteText, PDF_CONFIG.contentWidth - 20);
      quoteLines.forEach(line => {
        if (y > PDF_CONFIG.height - 60) {
          addPageNumber(pdf, tracker.currentPage);
          pdf.addPage();
          tracker.currentPage++;
          y = PDF_CONFIG.margin;
        }
        pdf.text(line, PDF_CONFIG.margin + 10, y);
        y += 7;
      });

      if (page.quote_attribute) {
        y += 3;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`— ${page.quote_attribute}`, PDF_CONFIG.margin + 10, y);
        y += 10;
      }
      pdf.setTextColor(0, 0, 0);
      y += 5;
    }

    if (page.content) {
      const contentText = parseMarkdownToText(page.content);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const contentLines = wrapText(pdf, contentText, PDF_CONFIG.contentWidth);
      contentLines.forEach(line => {
        if (y > PDF_CONFIG.height - 60) {
          addPageNumber(pdf, tracker.currentPage);
          pdf.addPage();
          tracker.currentPage++;
          y = PDF_CONFIG.margin;
        }
        pdf.text(line, PDF_CONFIG.margin, y);
        y += 6;
      });
    }

    addPageNumber(pdf, tracker.currentPage);
  }
}

async function addChapterGallery(
  pdf: jsPDF,
  chapter: ChapterWithFullData,
  tracker: PageTracker
): Promise<void> {
  if (!chapter.galleryItems || chapter.galleryItems.length === 0) return;

  const imagesPerPage = 4;
  const imageSpacing = 15;
  const captionHeight = 20;
  const availableHeight = PDF_CONFIG.height - (PDF_CONFIG.margin * 2) - 40;

  for (let i = 0; i < chapter.galleryItems.length; i += imagesPerPage) {
    pdf.addPage();
    tracker.currentPage++;

    const pageImages = chapter.galleryItems.slice(i, i + imagesPerPage);
    let currentY = PDF_CONFIG.margin;

    for (const item of pageImages) {
      try {
        const galleryImage = await loadImageAsBase64(item.image_url);
        const imgDimensions = await getImageDimensions(item.image_url);

        const maxImageHeight = availableHeight / imagesPerPage - captionHeight - imageSpacing;
        const dims = calculateImageDimensions(
          imgDimensions.width,
          imgDimensions.height,
          PDF_CONFIG.imageMaxWidth - 40,
          maxImageHeight
        );

        const x = (PDF_CONFIG.width - dims.width) / 2;
        pdf.addImage(galleryImage, 'JPEG', x, currentY, dims.width, dims.height);
        currentY += dims.height + 5;

        if (item.image_caption || item.image_title) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          const caption = item.image_title
            ? `${item.image_title}${item.image_caption ? ': ' + item.image_caption : ''}`
            : item.image_caption || '';
          const captionLines = wrapText(pdf, caption, PDF_CONFIG.imageMaxWidth - 40);
          captionLines.forEach(line => {
            pdf.text(line, PDF_CONFIG.width / 2, currentY, { align: 'center' });
            currentY += 5;
          });
        }

        currentY += imageSpacing;
      } catch (error) {
        console.error('Error adding gallery image:', error);
      }
    }

    addPageNumber(pdf, tracker.currentPage);
  }
}

async function addThankYouPage(pdf: jsPDF, tracker: PageTracker): Promise<void> {
  pdf.addPage();
  tracker.currentPage++;

  const centerY = PDF_CONFIG.height / 2 - 60;

  try {
    const logoImage = await loadImageAsBase64(SITE_ICON_URL);
    const logoWidth = 120;
    const logoHeight = 60;
    const x = (PDF_CONFIG.width - logoWidth) / 2;
    pdf.addImage(logoImage, 'PNG', x, centerY - 80, logoWidth, logoHeight);
  } catch (error) {
    console.error('Error adding logo to thank you page:', error);
  }

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  let y = centerY;

  const thankYouText = 'Thank you for reading my\nLasting Legacy Online Story';
  const lines = thankYouText.split('\n');
  lines.forEach(line => {
    pdf.text(line, PDF_CONFIG.width / 2, y, { align: 'center' });
    y += 14;
  });
}

export async function generateBookPDF(bookData: BookWithFullData, onProgress?: (progress: number) => void): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [PDF_CONFIG.width, PDF_CONFIG.height]
    });

    const tracker: PageTracker = {
      currentPage: 0,
      shouldShowPageNumber: false
    };

    const totalSteps = 5 + bookData.chapters.length * 3;
    let currentStep = 0;

    const updateProgress = () => {
      currentStep++;
      if (onProgress) {
        onProgress(Math.round((currentStep / totalSteps) * 100));
      }
    };

    await addCoverPage(pdf, bookData, tracker);
    updateProgress();

    await addBlankPage(pdf, tracker);
    updateProgress();

    await addTitlePage(pdf, bookData, tracker);
    updateProgress();

    await addBlankPage(pdf, tracker);
    updateProgress();

    await addDedicationPage(pdf, bookData, tracker);
    updateProgress();

    await addIntroPage(pdf, bookData, tracker);
    updateProgress();

    for (const chapter of bookData.chapters) {
      await addChapterTitlePage(pdf, chapter, tracker);
      updateProgress();

      await addChapterContent(pdf, chapter, tracker);
      updateProgress();

      await addChapterGallery(pdf, chapter, tracker);
      updateProgress();
    }

    await addThankYouPage(pdf, tracker);
    updateProgress();

    const fileName = `${bookData.book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

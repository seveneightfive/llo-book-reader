import { supabase, Chapter, Page } from './supabase';

export interface ChapterWithPages extends Chapter {
  pages: Page[];
}

export async function fetchAllPagesForChapters(chapters: Chapter[]): Promise<ChapterWithPages[]> {
  const chaptersWithPages: ChapterWithPages[] = [];

  for (const chapter of chapters) {
    try {
      const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('page_order');

      if (error) {
        console.error(`Error fetching pages for chapter ${chapter.chapter_order}:`, error);
        chaptersWithPages.push({ ...chapter, pages: [] });
      } else {
        chaptersWithPages.push({ ...chapter, pages: pages || [] });
      }
    } catch (err) {
      console.error(`Failed to fetch pages for chapter ${chapter.chapter_order}:`, err);
      chaptersWithPages.push({ ...chapter, pages: [] });
    }
  }

  return chaptersWithPages;
}
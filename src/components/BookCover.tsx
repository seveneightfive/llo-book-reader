import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===== TYPES MATCHING YOUR DATABASE SCHEMA EXACTLY =====

export type Book = {
  id: number;              // bigint
  created_at: string;
  title: string;
  author: string;
  slug: string;
  cover_image: string | null;
  dedication: string | null;
  intro: string | null;
  date_published: string;
  view_count: number;
};

export type Chapter = {
  id: number;              // bigint
  created_at: string;
  title: string;
  lede: string | null;
  book_id: number;         // bigint
  number: number;
  image_url: string | null;
};

export type Page = {
  id: number;              // bigint
  created_at: string;
  chapter_id: number;      // bigint
  content: string | null;
  sort_order: number;      // smallint
  image_url: string | null;
  quote: string | null;
  quote_attribute: string | null;
  image_caption: string | null;
  subtitle: string | null;
  final_order: number;     // smallint
};

export type GalleryItem = {
  id: number;              // bigint
  created_at: string;
  image_title: string | null;
  image_url: string;
  image_caption: string | null;
  sort_order: number;      // smallint
  chapter_id: number;      // bigint
  page_id: number | null;  // bigint (nullable)
};

// Helper types for queries
export type BookWithChapters = Book & {
  chapters: Chapter[];
};

export type ChapterWithPages = Chapter & {
  pages: Page[];
  gallery: GalleryItem[];
};
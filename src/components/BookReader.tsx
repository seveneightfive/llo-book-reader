import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===== CORRECTED TYPES TO MATCH YOUR DATABASE SCHEMA =====

export type Book = {
  id: number;              // bigint in database
  created_at: string;
  title: string;
  author: string;
  slug: string;
  image_url: string | null;  // Fixed: was cover_image
  dedication: string | null;
  intro: string | null;
  date_published: string;
  view_count: number;
};

export type Chapter = {
  id: number;              // bigint in database
  created_at: string;
  title: string;
  lede: string | null;
  book_id: number;         // bigint in database
  number: number;          // integer in database
  image_url: string | null;
  // Note: slug removed from chapters table
};

export type Page = {
  id: number;              // bigint in database
  created_at: string;
  chapter_id: number;      // bigint in database
  content: string | null;
  sort_order: number;      // smallint in database
  image_url: string | null;
  quote: string | null;
  quote_attribute: string | null;
  image_caption: string | null;
  subtitle: string | null;
  final_order: number;     // smallint in database
};

export type GalleryItem = {
  id: number;              // bigint in database
  created_at: string;
  image_title: string | null;
  image_url: string;
  image_caption: string | null;
  sort_order: number;      // smallint in database
  chapter_id: number;      // bigint in database
  page_id: number | null;  // bigint in database (nullable)
};

// ===== REMOVED: Answer type (table no longer exists in schema) =====

// ===== HELPER TYPES FOR QUERIES =====

export type BookWithChapters = Book & {
  chapters: Chapter[];
};

export type ChapterWithPages = Chapter & {
  pages: Page[];
  gallery: GalleryItem[];
};

export type PageWithGallery = Page & {
  gallery: GalleryItem[];
};
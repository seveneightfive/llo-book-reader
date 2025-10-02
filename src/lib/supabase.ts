import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: number;
  created_at: string;
  title: string;
  author: string;
  slug: string;
  cover_image: string | null;
  dedication: string | null;
  intro: string | null;
  date_published: string | null;
  view_count: number;
};

export type Chapter = {
  id: number;
  created_at: string;
  title: string;
  lede: string | null;
  book_id: number;
  chapter_number: number;
  image_url: string | null;
  slug: string | null;
};

export type Page = {
  id: number;
  created_at: string;
  chapter_id: number;
  page_content: string | null;
  page_order: number;
  page_image_url: string | null;
  page_quote: string | null;
  page_quote_attribute: string | null;
  page_image_caption: string | null;
  page_title: string | null;
};

export type GalleryItem = {
  id: number;
  created_at: string;
  gallery_image_title: string | null;
  gallery_image_url: string;
  gallery_image_caption: string | null;
  galllery_image_order: number; // Note: keeping the typo as it exists in the database
  chapter_id: number;
  page_id: number;
};

export type Answer = {
  id: string;
  chapter_id: string;
  question: string | null;
  content: string | null;
  sort_order: number;
};
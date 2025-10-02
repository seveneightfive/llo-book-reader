import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: string;
  created_at: string;
  title: string;
  author: string;
  slug: string;
  image_url: string | null;
  dedication: string | null;
  intro: string | null;
  view_count: number;
  date_published: string | null;
};

export type Chapter = {
  id: string;
  created_at: string;
  title: string;
  lede: string | null;
  book_id: string;
  number: number;
  image_url: string | null;
};

export type Page = {
  id: string;
  created_at: string;
  chapter_id: string;
  content: string | null;
  image_url: string | null;
  image_caption: string | null;
  sort_order: number;
};

export type GalleryItem = {
  id: number;
  created_at: string;
  book_id: string;
  chapter_id: number;
  page_id: number;
  image_url: string;
  image_title: string | null;
  image_caption: string | null;
  sort_order: number;
};

export type Answer = {
  id: string;
  chapter_id: string;
  question: string | null;
  content: string | null;
  sort_order: number;
};
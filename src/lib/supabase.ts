import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string | null;
  cover_image: string | null;
  datePublished: number | null;
  dedication: string | null;
  intro: string | null;
  User: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type Chapter = {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  intro: string | null;
  lede: string | null;
  chapter_image: string | null;
  user: string | null;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  chapter_id: string;
  content: string | null;
  subheading: string | null;
  quote: string | null;
  image_url: string | null;
  image_caption: string | null;
  sortOrder: number;
  user: string | null;
  book_id: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  book_id: string;
  chapterid: string;
  image: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
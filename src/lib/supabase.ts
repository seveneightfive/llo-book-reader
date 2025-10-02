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
  cover_image: string | null;
  dedication: string | null;
  intro: string | null;
  view_count: number;
};

export type Chapter = {
  id: string;
  created_at: string;
  title: string;
  heading: string | null;
  lede: string | null;
  book_id: string;
  chapter_number: number;
  image: string | null;
};

export type Page = {
  id: string;
  created_at: string;
  chapter_id: string;
  type: 'subheading' | 'content' | 'quote' | 'image';
  content: string | null;
  image: string | null;
  image_caption: string | null;
  order_index: number;
};

export type GalleryItem = {
  id: string;
  created_at: string;
  book_id: string;
  chapter_id: string;
  image: string;
  caption: string | null;
  sort_order: number;
};

export type Answer = {
  id: string;
  chapter_id: string;
  question: string | null;
  content: string | null;
  sort_order: number;
};
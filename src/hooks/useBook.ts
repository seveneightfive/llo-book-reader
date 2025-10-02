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
  view_count: number;
};

export type Chapter = {
  id: number;
  created_at: string;
  book_id: number;
  chapter_number: number;
  title: string;
  heading: string | null;
  lede: string | null;
  image: string | null;
};

export type Page = {
  id: number;
  created_at: string;
  chapter_id: number;
  type: 'subheading' | 'content' | 'quote' | 'image';
  content: string | null;
  image: string | null;
  image_caption: string | null;
  page_order: number;
};

export type GalleryItem = {
  id: string;
  created_at: string;
  chapter_id: string;
  gallery_image_url: string;
  gallery_image_title: string | null;
  gallery_image_caption: string | null;
  gallery_image_order: number;
};

export type Answer = {
  id: number;
  chapter_id: string;
  question: string | null;
  content: string | null;
};
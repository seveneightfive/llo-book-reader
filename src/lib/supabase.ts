import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  cover_image: string | null;
  datePublished: number | null;
  created_at: string;
  updated_at: string;
  dedication: string | null;
  intro: string | null;
  User: string | null;
  view_count: number;
  co_author: string | null;
  whalesync_id: string;
};

export type Chapter = {
  id: string;
  Related_Books: string;
  title: string;
  chapter_number: number;
  created_at: string;
  updated_at: string;
  chapter_image: string | null;
  lede: string | null;
  intro: string | null;
  user: string | null;
  publish_chapter: boolean | null;
  whalesync_id: string;
};

export type Page = {
  id: string;
  Related_Chapters: string;
  content: string | null;
  image_url: string | null;
  image_caption: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  subheading: string | null;
  quote: string | null;
  user: string | null;
  Related_Books: string | null;
  question_number: string | null;
  whalesync_id: string;
};

export type GalleryItem = {
  Related_Books: string;
  caption: string | null;
  Related_Chapters: string;
  image: string;
  ownerid: string | null;
  pageid: string | null;
  rowid: string | null;
  sort_order: string | null;
  image_title: string | null;
  whalesync_id: string;
};
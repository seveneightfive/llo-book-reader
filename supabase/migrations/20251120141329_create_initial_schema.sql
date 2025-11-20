/*
  # Create initial database schema

  1. New Tables
    - `books`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `author` (text)
      - `slug` (text, unique)
      - `image_url` (text, nullable)
      - `dedication` (text, nullable)
      - `intro` (text, nullable)
      - `date_published` (date)
      - `user` (text)
      - `view_count` (integer, default 0)
      - `filloutform_link` (text, nullable)

    - `chapters`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `lede` (text, nullable)
      - `book_id` (bigint, foreign key)
      - `number` (integer)
      - `image_url` (text, nullable)

    - `pages`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `chapter_id` (bigint, foreign key)
      - `content` (text, nullable)
      - `sort_order` (smallint)
      - `image_url` (text, nullable)
      - `quote` (text, nullable)
      - `quote_attribute` (text, nullable)
      - `image_caption` (text, nullable)
      - `subtitle` (text, nullable)
      - `final_order` (smallint)

    - `gallery`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `image_title` (text, nullable)
      - `image_url` (text)
      - `image_caption` (text, nullable)
      - `sort_order` (smallint)
      - `chapter_id` (bigint, foreign key)
      - `page_id` (bigint, nullable, foreign key)

    - `guestbook`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `user` (text, matches book.user)
      - `guest` (text, name of guest)
      - `message` (text, guestbook message)
      - `private` (boolean, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policy for view count updates on books

  3. Indexes
    - Create indexes for foreign keys and frequently queried columns
*/

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  author text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  dedication text,
  intro text,
  date_published date NOT NULL,
  "user" text NOT NULL,
  view_count integer DEFAULT 0,
  filloutform_link text
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public view count updates"
  ON books FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_user ON books("user");

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  lede text,
  book_id bigint NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  number integer NOT NULL,
  image_url text
);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapters are publicly readable"
  ON chapters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  chapter_id bigint NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  content text,
  sort_order smallint NOT NULL,
  image_url text,
  quote text,
  quote_attribute text,
  image_caption text,
  subtitle text,
  final_order smallint NOT NULL
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are publicly readable"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_pages_chapter_id ON pages(chapter_id);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  image_title text,
  image_url text NOT NULL,
  image_caption text,
  sort_order smallint DEFAULT 0,
  chapter_id bigint NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  page_id bigint REFERENCES pages(id) ON DELETE SET NULL
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery items are publicly readable"
  ON gallery FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_gallery_chapter_id ON gallery(chapter_id);
CREATE INDEX IF NOT EXISTS idx_gallery_page_id ON gallery(page_id);

-- Guestbook table
CREATE TABLE IF NOT EXISTS guestbook (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  "user" text NOT NULL,
  guest text NOT NULL,
  message text NOT NULL,
  private boolean DEFAULT NULL
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public guestbook entries are readable"
  ON guestbook FOR SELECT
  TO anon, authenticated
  USING (private IS NULL OR private = false);

CREATE INDEX IF NOT EXISTS idx_guestbook_user ON guestbook("user");
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);

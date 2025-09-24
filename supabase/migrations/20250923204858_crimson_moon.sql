/*
  # Book Reader Database Schema

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `author` (text)
      - `cover_image` (text)
      - `dedication` (text)
      - `intro` (text)
      - `created_at` (timestamp)
    
    - `chapters`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `chapter_number` (integer)
      - `title` (text)
      - `lede` (text)
      - `chapter_image` (text)
      - `created_at` (timestamp)
    
    - `pages`
      - `id` (uuid, primary key)
      - `chapter_id` (uuid, foreign key)
      - `book_id` (uuid, foreign key)
      - `content` (text)
      - `image_url` (text)
      - `image_caption` (text)
      - `subheading` (text)
      - `quote` (text)
      - `sortOrder` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  cover_image text,
  dedication text,
  intro text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  chapter_number integer NOT NULL,
  title text NOT NULL,
  heading text,
  lede text,
  image text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('subheading', 'content', 'quote', 'image')),
  content text,
  image text,
  image_caption text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Chapters are publicly readable"
  ON chapters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Pages are publicly readable"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample data
INSERT INTO books (slug, title, author, cover_image, dedication, intro) VALUES
('lasting-legacy-online', 'Lasting Legacy Online', 'Anonymous Author', 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg', 'To all the dreamers who dare to leave their mark on this world, may your legacy inspire generations to come.', 'In the digital age, our stories transcend physical boundaries. This is a tale of connection, purpose, and the lasting impact we create in the virtual spaces we inhabit.');

INSERT INTO chapters (book_id, chapter_number, title, heading, lede, image) 
SELECT 
  b.id,
  1,
  'The Digital Canvas',
  'Where Stories Begin',
  'Every pixel tells a story, every click creates a connection. In the vast expanse of the internet, we find our canvas.',
  'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg'
FROM books b WHERE b.slug = 'lasting-legacy-online';

INSERT INTO chapters (book_id, chapter_number, title, heading, lede, image)
SELECT 
  b.id,
  2,
  'Connections Across Time',
  'Building Bridges',
  'Technology becomes the bridge that spans generations, connecting hearts and minds across the digital divide.',
  'https://images.pexels.com/photos/2041396/pexels-photo-2041396.jpeg'
FROM books b WHERE b.slug = 'lasting-legacy-online';

-- Insert sample pages for Chapter 1
INSERT INTO pages (chapter_id, type, content, order_index)
SELECT 
  c.id,
  'subheading',
  'The Birth of Digital Storytelling',
  1
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

INSERT INTO pages (chapter_id, type, content, image, image_caption, order_index)
SELECT 
  c.id,
  'content',
  'In the beginning, there was silence. The kind of silence that exists before creation, before the first line of code is written, before the first story is told. Sarah stared at the blank screen, her fingers hovering over the keyboard like a painter before a pristine canvas.',
  'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg',
  'A writer contemplates the infinite possibilities of a blank page',
  2
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

INSERT INTO pages (chapter_id, type, content, order_index)
SELECT 
  c.id,
  'quote',
  'The internet is not just a network of computers; it is a network of human dreams, aspirations, and stories waiting to be told.',
  3
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

INSERT INTO pages (chapter_id, type, content, image, image_caption, order_index)
SELECT 
  c.id,
  'content',
  'She had always believed that every story had the power to change someone''s life. Now, with the tools of the digital age at her disposal, she could reach people she would never meet, touch hearts in places she would never visit. This was her lasting legacy online—a tapestry of words woven through the infinite web of human connection.',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
  'Digital connections spanning the globe',
  4
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

-- Insert sample pages for Chapter 2
INSERT INTO pages (chapter_id, type, content, order_index)
SELECT 
  c.id,
  'subheading',
  'The Ripple Effect',
  1
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 2;

INSERT INTO pages (chapter_id, type, content, image, image_caption, order_index)
SELECT 
  c.id,
  'content',
  'Marcus discovered the story three months after Sarah published it. He was going through one of the darkest periods of his life, feeling disconnected from purpose and meaning. Her words found him at exactly the right moment, like a message in a bottle washing up on the shore of his consciousness.',
  'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg',
  'A moment of connection in the digital world',
  2
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 2;

INSERT INTO pages (chapter_id, type, content, order_index)
SELECT 
  c.id,
  'content',
  'He shared the story with his daughter, who shared it with her classmates, who shared it with their parents. Each share was a ripple, expanding outward in concentric circles of influence that Sarah would never fully comprehend.',
  3
FROM chapters c 
JOIN books b ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 2;
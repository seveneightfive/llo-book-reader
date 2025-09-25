/*
  # Create GalleryItems table for chapter image galleries

  1. New Tables
    - `gallery_items`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key to books)
      - `chapter_id` (uuid, foreign key to chapters)
      - `image` (text, URL of the image)
      - `caption` (text, caption that appears below image)
      - `sort_order` (integer, for ordering images in gallery)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on gallery_items table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  image text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Gallery items are publicly readable"
  ON gallery_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_chapter_id ON gallery_items(chapter_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_book_id ON gallery_items(book_id);

-- Insert sample gallery items for the existing book
INSERT INTO gallery_items (book_id, chapter_id, image, caption, sort_order)
SELECT 
  b.id,
  c.id,
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
  'Digital connections spanning across the virtual landscape',
  1
FROM books b 
JOIN chapters c ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

INSERT INTO gallery_items (book_id, chapter_id, image, caption, sort_order)
SELECT 
  b.id,
  c.id,
  'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg',
  'A moment of creative inspiration in the digital age',
  2
FROM books b 
JOIN chapters c ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 1;

INSERT INTO gallery_items (book_id, chapter_id, image, caption, sort_order)
SELECT 
  b.id,
  c.id,
  'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg',
  'Finding connection in unexpected places',
  1
FROM books b 
JOIN chapters c ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 2;

INSERT INTO gallery_items (book_id, chapter_id, image, caption, sort_order)
SELECT 
  b.id,
  c.id,
  'https://images.pexels.com/photos/2041396/pexels-photo-2041396.jpeg',
  'Building bridges across generations through technology',
  2
FROM books b 
JOIN chapters c ON c.book_id = b.id 
WHERE b.slug = 'lasting-legacy-online' AND c.chapter_number = 2;
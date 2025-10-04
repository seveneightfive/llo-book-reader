/*
  # Create gallery table for chapter image galleries

  1. New Tables
    - `gallery`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `image_title` (text, nullable)
      - `image_url` (text, required)
      - `image_caption` (text, nullable)
      - `sort_order` (smallint, for ordering images)
      - `chapter_id` (bigint, foreign key to chapters)
      - `page_id` (bigint, nullable, foreign key to pages)

  2. Security
    - Enable RLS on gallery table
    - Add policy for public read access

  3. Indexes
    - Create index on chapter_id for better query performance
*/

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

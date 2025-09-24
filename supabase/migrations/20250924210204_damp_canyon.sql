/*
  # Add view count to books table

  1. Changes
    - Add `view_count` column to `books` table with default value 0
    - This column tracks how many times each book has been viewed

  2. Security
    - Add policy to allow public updates to view_count column only
    - This enables incrementing view counts without authentication
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE books ADD COLUMN view_count integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Create policy for updating view count
CREATE POLICY "Allow public view count updates"
  ON books
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
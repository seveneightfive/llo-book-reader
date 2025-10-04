/*
  # Add filloutform_link column to books table

  1. Changes
    - Add `filloutform_link` column to `books` table
    - Column stores URL to Fillout form for guest book functionality
    - Column is nullable to allow books without guest book forms
    - Text type allows for flexible URL storage

  2. Notes
    - This column enables integration with Fillout forms for reader engagement
    - The link will open in a new tab when clicked from navigation menu or thank you page
    - Empty/null values are handled gracefully in the UI with conditional rendering
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'filloutform_link'
  ) THEN
    ALTER TABLE books ADD COLUMN filloutform_link text;
  END IF;
END $$;
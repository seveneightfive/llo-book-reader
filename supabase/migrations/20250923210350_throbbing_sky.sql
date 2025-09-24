/*
  # Add order_index column to pages table

  1. Changes
    - Add `order_index` column to `pages` table with default value 0
    - This column is used to order pages within a chapter for proper display sequence

  2. Notes
    - Column is added with NOT NULL constraint and default value for existing records
    - Integer type allows for flexible ordering of page content
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE pages ADD COLUMN order_index integer NOT NULL DEFAULT 0;
  END IF;
END $$;
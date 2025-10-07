/*
  # Create guestbook table for book visitor messages

  1. New Tables
    - `guestbook`
      - `id` (bigint, primary key)
      - `created_at` (timestamp)
      - `user` (text, matches book.user to associate with specific book)
      - `guest` (text, name of the person leaving the message)
      - `message` (text, the guestbook message content)
      - `private` (boolean, if true the entry is hidden from public view)

  2. Security
    - Enable RLS on guestbook table
    - Add policy for public read access to non-private entries

  3. Indexes
    - Create index on user field for better query performance when filtering by book
    - Create index on created_at for efficient sorting
*/

CREATE TABLE IF NOT EXISTS guestbook (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  user text NOT NULL,
  guest text NOT NULL,
  message text NOT NULL,
  private boolean DEFAULT NULL
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public guestbook entries are readable"
  ON guestbook FOR SELECT
  TO anon, authenticated
  USING (private IS NULL OR private = false);

CREATE INDEX IF NOT EXISTS idx_guestbook_user ON guestbook(user);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);

-- ============================================
-- COMPREHENSIVE RLS FIX
-- Run this in Supabase SQL Editor to fix all policies
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 2. ARTISTS TABLE
-- ============================================
DROP POLICY IF EXISTS "Anyone can view approved artists" ON artists;
DROP POLICY IF EXISTS "Artists can view own profile" ON artists;
DROP POLICY IF EXISTS "Users can create own artist profile" ON artists;
DROP POLICY IF EXISTS "Artists can create own profile" ON artists;
DROP POLICY IF EXISTS "Artists can update their own profile" ON artists;
DROP POLICY IF EXISTS "Admins can view all artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;

-- Public can view approved artists
CREATE POLICY "Anyone can view approved artists"
  ON artists FOR SELECT
  USING (status = 'approved');

-- Users can view their own artist profile (any status)
CREATE POLICY "Users can view own artist profile"
  ON artists FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own artist profile
CREATE POLICY "Users can create own artist profile"
  ON artists FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own artist profile
CREATE POLICY "Users can update own artist profile"
  ON artists FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins can manage all artists"
  ON artists FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 3. PORTFOLIO_ITEMS TABLE
-- ============================================
DROP POLICY IF EXISTS "Anyone can view portfolio items of approved artists" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can view own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can insert own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can update own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can delete own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admins can manage all portfolio items" ON portfolio_items;

-- Public can view portfolio of approved artists
CREATE POLICY "Anyone can view portfolio items of approved artists"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.status = 'approved'
    )
  );

-- Artists can view their own portfolio
CREATE POLICY "Artists can view own portfolio items"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can insert their own portfolio items
CREATE POLICY "Artists can insert own portfolio items"
  ON portfolio_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can update their own portfolio items
CREATE POLICY "Artists can update own portfolio items"
  ON portfolio_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can delete their own portfolio items
CREATE POLICY "Artists can delete own portfolio items"
  ON portfolio_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Admins can manage all portfolio items
CREATE POLICY "Admins can manage all portfolio items"
  ON portfolio_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. STORAGE (images bucket)
-- ============================================
-- Make sure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop and recreate storage policies
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;

-- Anyone authenticated can upload to images bucket
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Anyone can read from images bucket (it's public)
CREATE POLICY "Allow public reads"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Authenticated users can update their uploads
CREATE POLICY "Allow authenticated updates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

-- Authenticated users can delete their uploads
CREATE POLICY "Allow authenticated deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- ============================================
-- DONE! All policies should now be correct.
-- ============================================

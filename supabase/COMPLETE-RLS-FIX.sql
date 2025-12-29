-- ============================================
-- COMPLETE RLS FIX FOR PENANG ARTISTS PLATFORM
-- ============================================
-- This fixes the infinite recursion bug and implements
-- proper RLS patterns based on Supabase best practices.
--
-- References:
-- - https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
-- - https://github.com/orgs/supabase/discussions/1138
-- - https://supabase.com/docs/guides/auth/managing-user-data
--
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CREATE SECURITY DEFINER FUNCTIONS
-- ============================================
-- These functions bypass RLS and prevent infinite recursion.
-- They use SECURITY DEFINER to run with creator privileges.

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Function to check if current user is artist
CREATE OR REPLACE FUNCTION public.is_artist()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'artist'
  );
END;
$$;

-- Function to get current user's role (useful for debugging)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM profiles
  WHERE id = auth.uid();
  RETURN user_role_value;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_artist() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- ============================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ============================================
-- Clean slate to avoid conflicts

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Artists
DROP POLICY IF EXISTS "Anyone can view approved artists" ON artists;
DROP POLICY IF EXISTS "Admins can view all artists" ON artists;
DROP POLICY IF EXISTS "Artists can view their own profile" ON artists;
DROP POLICY IF EXISTS "Users can view own artist profile" ON artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Artists can create their own profile" ON artists;
DROP POLICY IF EXISTS "Users can create own artist profile" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Artists can update their own profile" ON artists;
DROP POLICY IF EXISTS "Users can update own artist profile" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;
DROP POLICY IF EXISTS "Admins can manage all artists" ON artists;

-- Portfolio items
DROP POLICY IF EXISTS "Anyone can view portfolio items of approved artists" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can view their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can view own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admins can manage all portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can insert their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can insert own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can update their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can update own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can delete their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Artists can delete own portfolio items" ON portfolio_items;

-- Inquiries
DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Artists can view their own inquiries" ON inquiries;

-- Audit log
DROP POLICY IF EXISTS "Admins can view audit log" ON audit_log;
DROP POLICY IF EXISTS "System can insert audit log" ON audit_log;

-- ============================================
-- STEP 3: CREATE NEW POLICIES (USING FUNCTIONS)
-- ============================================

-- -----------------------------------------
-- PROFILES TABLE
-- -----------------------------------------
-- Users can view their own profile (simple, no recursion)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admins can view all profiles (uses function - NO RECURSION)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin());

-- -----------------------------------------
-- ARTISTS TABLE
-- -----------------------------------------
-- Public can view approved artists (no auth required)
CREATE POLICY "Public can view approved artists"
  ON artists FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Artists can view their own profile (any status)
CREATE POLICY "Artists can view own profile"
  ON artists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Artists can create their own profile
CREATE POLICY "Artists can create own profile"
  ON artists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Artists can update their own profile
CREATE POLICY "Artists can update own profile"
  ON artists FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins have full access to all artists
CREATE POLICY "Admins full access to artists"
  ON artists FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- -----------------------------------------
-- PORTFOLIO ITEMS TABLE
-- -----------------------------------------
-- Public can view portfolio of approved artists
CREATE POLICY "Public can view approved portfolios"
  ON portfolio_items FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id
      AND artists.status = 'approved'
    )
  );

-- Artists can view their own portfolio
CREATE POLICY "Artists can view own portfolio"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id
      AND artists.user_id = auth.uid()
    )
  );

-- Artists can insert into their own portfolio
CREATE POLICY "Artists can insert own portfolio"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id
      AND artists.user_id = auth.uid()
    )
  );

-- Artists can update their own portfolio
CREATE POLICY "Artists can update own portfolio"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id
      AND artists.user_id = auth.uid()
    )
  );

-- Artists can delete from their own portfolio
CREATE POLICY "Artists can delete own portfolio"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id
      AND artists.user_id = auth.uid()
    )
  );

-- Admins have full access to all portfolios
CREATE POLICY "Admins full access to portfolios"
  ON portfolio_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- -----------------------------------------
-- INQUIRIES TABLE
-- -----------------------------------------
-- Anyone can create inquiries (public contact form)
CREATE POLICY "Anyone can create inquiries"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (is_admin());

-- Artists can view their own inquiries
CREATE POLICY "Artists can view own inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = inquiries.artist_id
      AND artists.user_id = auth.uid()
    )
  );

-- -----------------------------------------
-- AUDIT LOG TABLE
-- -----------------------------------------
-- Admins can view audit log
CREATE POLICY "Admins can view audit log"
  ON audit_log FOR SELECT
  TO authenticated
  USING (is_admin());

-- System can insert audit entries (any authenticated user for now)
CREATE POLICY "System can insert audit log"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- STEP 4: VERIFY USER DATA EXISTS
-- ============================================
-- Ensure the user profile has the correct role

-- Update any profiles with NULL role to 'artist'
UPDATE profiles
SET role = 'artist'
WHERE role IS NULL;

-- ============================================
-- STEP 5: CREATE PERFORMANCE INDEXES
-- ============================================
-- Add indexes for columns used in RLS policies

-- Index for user_id lookups on artists (used in multiple policies)
CREATE INDEX IF NOT EXISTS idx_artists_user_id ON artists(user_id);

-- Index for artist_id on portfolio_items (used in multiple policies)
CREATE INDEX IF NOT EXISTS idx_portfolio_items_artist_id ON portfolio_items(artist_id);

-- Index for artist_id on inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_artist_id ON inquiries(artist_id);

-- ============================================
-- VERIFICATION QUERIES
-- Run these after the fix to confirm it works
-- ============================================

-- Test 1: Can we query profiles now?
-- SELECT id, email, role FROM profiles LIMIT 5;

-- Test 2: Can we call the functions?
-- SELECT is_admin(), is_artist(), get_my_role();

-- Test 3: Can we query artists?
-- SELECT id, display_name, status FROM artists LIMIT 5;

-- ============================================
-- DONE!
-- ============================================
-- After running this:
-- 1. Test login at https://penangartists.com/login
-- 2. Check dashboard access at https://penangartists.com/dashboard
-- 3. Verify no infinite recursion errors
-- ============================================

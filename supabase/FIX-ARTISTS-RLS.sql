-- FIX RLS POLICIES FOR ARTISTS TABLE
-- Issue: Artists cannot create their own profile (INSERT blocked)
-- The original policy only allowed admins to insert

-- ============================================
-- STEP 1: Check current policies
-- ============================================
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'artists';

-- ============================================
-- STEP 2: Add policy for artists to INSERT their own profile
-- ============================================

-- Allow authenticated users to create ONE artist profile linked to their user_id
CREATE POLICY "Artists can create own profile"
  ON artists FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    NOT EXISTS (SELECT 1 FROM artists WHERE user_id = auth.uid())
  );

-- ============================================
-- STEP 3: Verify artists can view their own profile (even if not approved)
-- ============================================

-- Drop old policy if exists
DROP POLICY IF EXISTS "Artists can view own profile" ON artists;

-- Artists can view their own profile regardless of status
CREATE POLICY "Artists can view own profile"
  ON artists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- STEP 4: Verify the new policies
-- ============================================
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'artists';

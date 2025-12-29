-- ============================================
-- FIX INFINITE RECURSION IN PROFILES RLS
-- Run this in Supabase SQL Editor immediately!
--
-- PROBLEM: The "Admins can view all profiles" policy
-- queries the profiles table to check if user is admin,
-- which triggers the same policy check = infinite loop
-- ============================================

-- STEP 1: Drop the problematic policy FIRST (most critical)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- STEP 2: Create a SECURITY DEFINER function that bypasses RLS
-- This allows us to safely check admin status without triggering policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- STEP 3: Recreate admin policy using the function (no recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- STEP 4: Also fix admin policies on other tables to use the function
DROP POLICY IF EXISTS "Admins can manage all artists" ON artists;
CREATE POLICY "Admins can manage all artists"
  ON artists FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all portfolio items" ON portfolio_items;
CREATE POLICY "Admins can manage all portfolio items"
  ON portfolio_items FOR ALL
  USING (is_admin());

-- ============================================
-- VERIFICATION: Run these after the fix to confirm it worked
-- ============================================
-- SELECT id, email, role FROM profiles LIMIT 5;
-- SELECT display_name, status FROM artists LIMIT 5;
